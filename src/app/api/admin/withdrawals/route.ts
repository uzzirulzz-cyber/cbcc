import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticate, getAccessibleUserIds } from '@/lib/rbac';

// GET /api/admin/withdrawals — Sub-Agent sees only their customers'
export async function GET(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN', 'SUB_AGENT']);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const status = searchParams.get('status') || '';

    const where: any = { type: 'WITHDRAW' };
    if (status) where.status = status;

    // Sub-Agent: only their customers' withdrawals
    if (payload!.role === 'SUB_AGENT') {
      const allowedIds = await getAccessibleUserIds(payload!);
      where.userId = { in: allowedIds };
    }

    const [txs, total] = await Promise.all([
      prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.transaction.count({ where }),
    ]);

    const userIds = [...new Set(txs.map(t => t.userId))];
    const users = userIds.length > 0
      ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true, phone: true, agentId: true, invitationCode: true } })
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const enriched = txs.map(tx => ({ ...tx, _id: tx.id, user: userMap.get(tx.userId) || null }));

    return NextResponse.json({
      withdrawals: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/admin/withdrawals — approve/reject (SUPER_ADMIN only)
export async function PUT(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN']);
    if (response) return response;

    const { txId, status } = await request.json();
    if (!txId || !status) {
      return NextResponse.json({ error: 'txId and status required' }, { status: 400 });
    }
    if (!['COMPLETED', 'CANCELLED', 'FAILED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const tx = await prisma.transaction.update({ where: { id: txId }, data: { status } });

    return NextResponse.json({ message: `Withdrawal ${status.toLowerCase()}`, transaction: tx });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
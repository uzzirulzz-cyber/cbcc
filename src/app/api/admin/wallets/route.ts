/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authenticate, getAccessibleUserIds } from '@/lib/rbac';

// GET /api/admin/wallets — list wallets (Sub-Agent: only their customers)
export async function GET(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN', 'SUB_AGENT']);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const userId = searchParams.get('userId') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    // Sub-Agent: restrict to their customers' wallets only
    if (payload!.role === 'SUB_AGENT') {
      const allowedIds = await getAccessibleUserIds(payload!);
      where.userId = { in: allowedIds };
    } else if (userId) {
      where.userId = userId;
    }

    const [wallets, total] = await Promise.all([
      prisma.wallet.findMany({
        where,
        include: { balances: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wallet.count({ where }),
    ]);

    const userIds = [...new Set(wallets.map(w => w.userId))];
    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true, role: true, status: true, agentId: true, invitationCode: true },
        })
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const enriched = wallets.map(w => ({
      id: w.id,
      userId: w.userId,
      type: w.type,
      status: w.status,
      totalEquity: w.totalEquity,
      balances: w.balances,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
      _id: w.id,
      user: userMap.get(w.userId) || null,
    }));

    // Only SUPER_ADMIN sees total platform equity
    let summary: any = { walletCount: total };
    if (payload!.role === 'SUPER_ADMIN') {
      const totalEquityResult = await prisma.wallet.aggregate({ _sum: { totalEquity: true } });
      summary.totalEquity = totalEquityResult._sum.totalEquity || 0;
    }

    return NextResponse.json({
      wallets: enriched,
      summary,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin/wallets — adjust balance (SUPER_ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const { payload, response } = authenticate(request, ['SUPER_ADMIN']);
    if (response) return response;

    const body = await request.json();
    const { userId, walletType, currency, amount, reason } = body;

    if (!userId || !currency || amount === undefined) {
      return NextResponse.json({ error: 'userId, currency, and amount are required' }, { status: 400 });
    }
    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'amount must be a number' }, { status: 400 });
    }

    const upperCurrency = currency.toUpperCase();
    const wFilter: any = { userId };
    if (walletType) wFilter.type = walletType;

    let wallet = await prisma.wallet.findFirst({ where: wFilter, include: { balances: true } });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, type: walletType || 'SPOT', status: 'ACTIVE', totalEquity: 0 },
        include: { balances: true },
      });
    }

    if (wallet.status === 'FROZEN') {
      return NextResponse.json({ error: 'Wallet is frozen' }, { status: 400 });
    }

    let balance = wallet.balances.find(b => b.currency === upperCurrency);
    if (!balance) {
      balance = await prisma.walletBalance.create({
        data: { walletId: wallet.id, currency: upperCurrency, amount: 0, frozen: 0 },
      });
    }

    const previousAmount = balance.amount;
    const newAmount = balance.amount + amount;

    if (newAmount < 0) {
      return NextResponse.json({ error: 'Insufficient balance for this adjustment' }, { status: 400 });
    }

    await prisma.walletBalance.update({ where: { id: balance.id }, data: { amount: newAmount } });

    const allBalances = await prisma.walletBalance.findMany({ where: { walletId: wallet.id } });
    const totalEquity = allBalances.reduce((s, b) => s + b.amount + b.frozen, 0);
    await prisma.wallet.update({ where: { id: wallet.id }, data: { totalEquity } });

    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: amount > 0 ? 'DEPOSIT' : 'WITHDRAW',
        status: 'COMPLETED',
        currency: upperCurrency,
        amount: Math.abs(amount),
        fee: 0,
        description: reason || `Admin balance adjustment: ${amount > 0 ? '+' : ''}${amount} ${upperCurrency}`,
        metadata: { adminAction: true, adminId: payload!.userId, walletId: wallet.id, previousAmount, newAmount },
      },
    });

    return NextResponse.json({
      message: 'Balance adjusted successfully',
      wallet: { ...wallet, balances: allBalances, totalEquity },
      transaction: tx,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
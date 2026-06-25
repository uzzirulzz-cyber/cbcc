import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken, extractBearerToken } from '@/lib/auth';
import Wallet from '@/models/Wallet';

// GET /api/wallet — returns current user's wallet balance
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = extractBearerToken(request.headers.get('authorization'));
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const wallets = await Wallet.find({ userId: payload.userId }).lean();
    const totalEquity = wallets.reduce((sum, w) => sum + (w.totalEquity || 0), 0);

    return NextResponse.json({
      wallets,
      totalEquity,
      formatted: `$${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
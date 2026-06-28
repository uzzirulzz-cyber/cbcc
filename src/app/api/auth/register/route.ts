import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, password, invitationCode, name } = body;

    // Invitation code is REQUIRED for registration
    if (!invitationCode || !invitationCode.trim()) {
      return NextResponse.json({ error: 'Invitation code is required to register' }, { status: 400 });
    }

    // Support both { firstName, lastName } and legacy { name } formats
    let finalFirstName = firstName?.trim();
    let finalLastName = lastName?.trim();
    let fullName: string;

    if (finalFirstName && finalLastName) {
      fullName = `${finalFirstName} ${finalLastName}`.trim();
    } else if (name?.trim()) {
      const parts = name.trim().split(/\s+/);
      finalFirstName = parts[0] || '';
      finalLastName = parts.slice(1).join(' ') || '';
      fullName = name.trim();
    } else {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const codeUpper = invitationCode.trim().toUpperCase();

    // Validate invitation code
    const code = await prisma.invitationCode.findUnique({
      where: { code: codeUpper },
    });
    if (!code || code.status !== 'UNUSED') {
      return NextResponse.json({ error: 'Invalid or used invitation code' }, { status: 400 });
    }

    // Only USER role via invitation codes (sub-agents are seeded by admin)
    const role = 'USER';
    const referrerId = code.createdBy; // The Sub-Agent who owns this code

    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPw = await hashPassword(password);

    // Create user — permanently linked to Sub-Agent via agentId + invitationCode
    const user = await prisma.user.create({
      data: {
        name: fullName,
        firstName: finalFirstName || null,
        lastName: finalLastName || null,
        email: email.toLowerCase(),
        password: hashedPw,
        role,
        status: 'ACTIVE',
        phone: phone || null,
        agentId: referrerId,          // Permanent link to Sub-Agent
        invitationCode: codeUpper,    // Permanent record of which code was used
        referredBy: referrerId,
      },
    });

    // Mark code as used
    await prisma.invitationCode.update({
      where: { code: codeUpper },
      data: {
        status: 'USED',
        usedBy: user.id,
        usedAt: new Date(),
      },
    });

    // Create wallet with default balances
    await prisma.wallet.create({
      data: {
        userId: user.id,
        type: 'SPOT',
        totalEquity: 0,
        balances: {
          create: [
            { currency: 'USDT', amount: 0, frozen: 0 },
            { currency: 'BTC', amount: 0, frozen: 0 },
            { currency: 'ETH', amount: 0, frozen: 0 },
          ],
        },
      },
    });

    // Create referral record
    await prisma.referral.create({
      data: {
        referrerId,
        referredId: user.id,
        referralCode: codeUpper,
        level: 1,
        totalCommission: 0,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      agentId: referrerId,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        agentId: referrerId,
        invitationCode: codeUpper,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
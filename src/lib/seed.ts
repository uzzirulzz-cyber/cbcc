import User from '../models/User';
import InvitationCode from '../models/InvitationCode';
import AgentConfig from '../models/AgentConfig';
import Wallet from '../models/Wallet';
import { hashPassword } from './auth';

export async function seedDatabase() {
  const results: string[] = [];

  // ── Super Admin ──────────────────────────────────────────────
  const adminPw = await hashPassword('123playbeat');
  let admin = await User.findOne({ role: 'SUPER_ADMIN' });
  if (!admin) {
    admin = await User.create({
      name: 'Super Admin',
      email: 'crdbixx@gmail.com',
      password: adminPw,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    });
    results.push(`Created Super Admin: ${admin.email}`);

    // Admin wallet
    await Wallet.create({
      userId: admin._id.toString(),
      type: 'SPOT',
      balances: [
        { currency: 'USDT', amount: 1000000, frozen: 0 },
        { currency: 'BTC', amount: 10, frozen: 0 },
        { currency: 'ETH', amount: 100, frozen: 0 },
      ],
      totalEquity: 1000000 + 10 * 67000 + 100 * 3500,
    });
  }

  // ── 20 Sub-Agents ───────────────────────────────────────────
  const agentPw = await hashPassword('default');
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];

  for (let i = 1; i <= 20; i++) {
    const email = `subagent${i}@trade${i <= 1 ? '.com' : i + '.com'}`;
    const code = `PB-AG${String(i).padStart(3, '0')}`;
    const name = `SubAgent ${i}`;

    // Check if agent already exists by email
    const existing = await User.findOne({ email });
    if (existing) {
      results.push(`Sub-Agent ${i} already exists (${email})`);
      continue;
    }

    const agent = await User.create({
      name,
      email,
      password: agentPw,
      role: 'SUB_AGENT',
      status: 'ACTIVE',
      agentId: admin._id.toString(),
    });

    // Wallet for agent
    await Wallet.create({
      userId: agent._id.toString(),
      type: 'SPOT',
      balances: [
        { currency: 'USDT', amount: 10000, frozen: 0 },
        { currency: 'BTC', amount: 0.5, frozen: 0 },
      ],
      totalEquity: 10000 + 0.5 * 67000,
    });

    // Agent config
    await AgentConfig.create({
      agentId: agent._id.toString(),
      commissionRate: 0.15,
      referralRate: 0.05,
      maxUsers: 100,
      maxLeverage: 100,
      allowedSymbols: symbols,
      riskLimit: 100000,
    });

    // Invitation code
    await InvitationCode.findOneAndUpdate(
      { code },
      {
        code,
        role: 'SUB_AGENT',
        createdBy: admin._id.toString(),
        status: 'USED',
        usedBy: agent._id.toString(),
        usedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    results.push(`Created Sub-Agent ${i}: ${email} (${code})`);
  }

  // ── User Invitation Codes (if not exist) ─────────────────────
  for (let i = 1; i <= 50; i++) {
    const code = `PB-US${String(i).padStart(4, '0')}`;
    const exists = await InvitationCode.findOne({ code });
    if (!exists) {
      await InvitationCode.create({
        code,
        role: 'USER',
        createdBy: admin._id.toString(),
        status: 'UNUSED',
      });
    }
  }

  return {
    message: results.length ? `Seeded: ${results.join('; ')}` : 'Database already up to date',
    details: results,
  };
}
'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
export default function WithdrawalManagementPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Withdrawal Management</h1>
      </div>
      <div className="glass-card p-8 text-center" style={{ color: '#7A8599' }}>
        <ArrowUpRight size={40} style={{ color: '#0F5EFF', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 16, fontWeight: 500 }}>Withdrawal requests will appear here</p>
        <p style={{ fontSize: 13, marginTop: 8 }}>Users can request withdrawals from their wallet</p>
      </div>
    </div>
  );
}

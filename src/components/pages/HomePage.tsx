'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Shield,
  Zap,
  TrendingUp,
  Users,
  ArrowUpRight,
  BarChart3,
  Brain,
  Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ─── constants ─── */

const NAVY = '#081B3A';
const ROYAL = '#0F5EFF';
const ELECTRIC = '#38BDF8';
const SILVER = '#C0C7D1';
const WHITE = '#FFFFFF';
const GOLD = '#FFD700';
const MUTED = '#7A8599';
const GREEN = '#00E676';
const RED = '#FF4757';
const ORANGE = '#FF9F43';

const tickerItems = [
  { name: 'JazzCash', type: 'Online' },
  { name: 'Easypaisa', type: 'Online' },
  { name: 'Bank Transfer', type: 'Online' },
  { name: 'Crypto', type: 'Online' },
  { name: 'PayPal', type: 'Online' },
  { name: 'Skrill', type: 'Online' },
];

const cryptoPairs = [
  { pair: 'BTC/USDT', price: '$67,245', change: '+2.35%', positive: true },
  { pair: 'ETH/USDT', price: '$3,456', change: '+1.82%', positive: true },
  { pair: 'BNB/USDT', price: '$589', change: '-0.94%', positive: false },
  { pair: 'SOL/USDT', price: '$178', change: '+4.21%', positive: true },
  { pair: 'XRP/USDT', price: '$0.62', change: '-1.37%', positive: false },
  { pair: 'ADA/USDT', price: '$0.45', change: '+3.15%', positive: true },
];

const features = [
  { icon: Zap, title: 'Instant Deposits', desc: 'Fund your account instantly with multiple payment methods. Zero delays, zero hassle.' },
  { icon: ArrowUpRight, title: 'Fast Withdrawals', desc: 'Lightning-fast withdrawals processed 24/7. Your money, your timeline.' },
  { icon: Brain, title: 'AI Trading Tools', desc: 'Harness AI-powered signals and smart order execution for better trades.' },
  { icon: BarChart3, title: 'Portfolio Tracking', desc: 'Real-time analytics and performance dashboards to monitor your growth.' },
  { icon: Shield, title: 'Advanced Security', desc: 'Bank-grade encryption, 2FA, and cold storage keep your assets safe.' },
  { icon: Globe, title: 'Multi-Asset Trading', desc: 'Trade crypto, forex, stocks, and commodities all from one platform.' },
];

const plans = [
  { name: 'Starter', price: '$100', returnRate: '5% monthly', features: ['Basic trading tools', 'Email support', '5 trading pairs'], popular: false },
  { name: 'Professional', price: '$1,000', returnRate: '8% monthly', features: ['Advanced AI tools', 'Priority support', '50+ trading pairs', 'Portfolio analytics'], popular: true },
  { name: 'Business', price: '$10,000', returnRate: '12% monthly', features: ['Enterprise tools', 'Dedicated manager', 'All trading pairs', 'Custom strategies', 'API access'], popular: false },
  { name: 'VIP', price: '$50,000', returnRate: '18% monthly', features: ['All Business features', 'Private trading desk', 'Bespoke analytics', 'Risk management suite', 'White-glove onboarding'], popular: false },
];

const categoryTabs = ['Crypto', 'Forex', 'Stocks', 'Commodities', 'Indices'];

/* ─── animation helpers ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const fadeUpStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── component ─── */

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Crypto');
  const marketRef = useRef<HTMLElement>(null);

  const scrollToMarkets = () => {
    marketRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: NAVY }}>
      {/* ═══════════════ TICKER TAPE ═══════════════ */}
      <div
        className="w-full overflow-hidden py-2.5 border-b"
        style={{ backgroundColor: '#06142e', borderColor: 'rgba(192,199,209,0.08)' }}
      >
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -2400] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: GREEN }} />
              <span className="text-sm font-medium" style={{ color: SILVER }}>
                {item.name}
              </span>
              <span className="text-xs" style={{ color: MUTED }}>
                / {item.type}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 400, height: 400, top: -80, left: '10%',
              background: 'radial-gradient(circle, rgba(15,94,255,0.25) 0%, transparent 70%)',
            }}
            animate={{ y: [0, 30, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 300, height: 300, top: 40, right: '5%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)',
            }}
            animate={{ y: [0, -25, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 250, height: 250, bottom: -40, left: '30%',
              background: 'radial-gradient(circle, rgba(15,94,255,0.18) 0%, transparent 70%)',
            }}
            animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
        </div>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative z-10 mb-8">
          <Image src="/logo.png" alt="NexTrade Pro" width={120} height={120} className="drop-shadow-2xl" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span style={{ color: WHITE }}>Trade Smarter with</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF9F43)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            NexTrade Pro
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="relative z-10 max-w-2xl text-base sm:text-lg md:text-xl mb-10 leading-relaxed"
          style={{ color: SILVER }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Institutional-grade trading platform with AI-powered tools, instant deposits, and multi-asset
          markets. Built for traders who demand excellence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <button
            onClick={() => router.push('/signin')}
            className="px-8 py-3.5 rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF9F43)',
              color: NAVY,
              boxShadow: '0 0 30px rgba(255,215,0,0.35), 0 4px 15px rgba(255,215,0,0.2)',
            }}
          >
            Start Trading
          </button>
          <button
            onClick={scrollToMarkets}
            className="px-8 py-3.5 rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              background: 'transparent',
              color: ELECTRIC,
              border: `2px solid ${ROYAL}`,
            }}
          >
            Explore Markets
          </button>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          className="relative z-10 flex items-center gap-2"
          style={{ color: MUTED }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Users size={18} />
          <span className="text-sm">Trusted by 50K+ traders worldwide</span>
        </motion.div>
      </section>

      {/* ═══════════════ MARKET OVERVIEW ═══════════════ */}
      <section ref={marketRef} className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8" style={{ color: WHITE }}>
            Global Markets
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200"
                style={{
                  background: activeTab === tab ? ROYAL : 'rgba(192,199,209,0.08)',
                  color: activeTab === tab ? WHITE : SILVER,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Crypto' ? (
            <motion.div
              className="grid gap-3"
              variants={fadeUpStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Table header */}
              <div
                className="hidden sm:grid grid-cols-[1fr_100px_90px_140px] gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider"
                style={{ color: MUTED }}
              >
                <span>Pair</span>
                <span className="text-right">Price</span>
                <span className="text-right">Change</span>
                <span className="text-right">Action</span>
              </div>

              {cryptoPairs.map((c) => (
                <motion.div
                  key={c.pair}
                  className="rounded-xl px-4 py-3.5 flex flex-col sm:grid sm:grid-cols-[1fr_100px_90px_140px] sm:items-center gap-2 sm:gap-4 transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    background: 'rgba(14, 34, 72, 0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(192,199,209,0.1)',
                  }}
                  variants={fadeUp}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg, ${ROYAL}, ${ELECTRIC})` }}
                    >
                      <TrendingUp size={16} color={WHITE} />
                    </div>
                    <span className="font-semibold" style={{ color: WHITE }}>
                      {c.pair}
                    </span>
                  </div>
                  <span className="sm:text-right font-medium" style={{ color: WHITE }}>
                    {c.price}
                  </span>
                  <span
                    className="sm:text-right font-semibold text-sm"
                    style={{ color: c.positive ? GREEN : RED }}
                  >
                    {c.change}
                  </span>
                  <div className="flex sm:justify-end gap-2">
                    <button
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105"
                      style={{ background: GREEN, color: NAVY }}
                    >
                      Buy
                    </button>
                    <button
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105"
                      style={{ background: RED, color: WHITE }}
                    >
                      Sell
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div
              className="flex flex-col items-center justify-center rounded-2xl py-20"
              style={{
                background: 'rgba(14, 34, 72, 0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(192,199,209,0.1)',
              }}
            >
              <Globe size={48} style={{ color: MUTED }} className="mb-4 opacity-40" />
              <p className="text-xl font-semibold" style={{ color: SILVER }}>
                Coming Soon
              </p>
              <p className="text-sm mt-1" style={{ color: MUTED }}>
                {activeTab} markets are on the way. Stay tuned!
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center"
            style={{ color: WHITE }}
            variants={fadeUp}
          >
            Why Choose NexTrade Pro
          </motion.h2>
          <motion.p className="text-center mb-12 max-w-xl mx-auto" style={{ color: MUTED }} variants={fadeUp}>
            Everything you need to trade smarter, faster, and safer.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={fadeUpStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                className="rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px] group cursor-default"
                style={{
                  background: 'rgba(14, 34, 72, 0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(192,199,209,0.1)',
                }}
                variants={fadeUp}
                whileHover={{
                  boxShadow: '0 0 30px rgba(15,94,255,0.15)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${ROYAL}, ${ELECTRIC})` }}
                >
                  <f.icon size={22} color={WHITE} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: WHITE }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ DASHBOARD PREVIEW ═══════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center" style={{ color: WHITE }}>
            Your Trading Dashboard
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: MUTED }}>
            Track, analyze, and optimize your trades in real time.
          </p>

          <motion.div
            className="rounded-2xl p-5 sm:p-6 transition-all duration-300"
            style={{
              background: 'rgba(14, 34, 72, 0.5)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(192,199,209,0.1)',
            }}
          >
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl p-4" style={{ background: 'rgba(15,94,255,0.1)', border: '1px solid rgba(15,94,255,0.15)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet size={16} style={{ color: ELECTRIC }} />
                  <span className="text-xs font-medium" style={{ color: MUTED }}>Total Balance</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: WHITE }}>$1,200,000</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.12)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} style={{ color: GREEN }} />
                  <span className="text-xs font-medium" style={{ color: MUTED }}>Today&apos;s PnL</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: GREEN }}>+$12,450</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(15,94,255,0.1)', border: '1px solid rgba(15,94,255,0.15)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={16} style={{ color: ELECTRIC }} />
                  <span className="text-xs font-medium" style={{ color: MUTED }}>Active Trades</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: WHITE }}>24</p>
              </div>
            </div>

            {/* Fake chart */}
            <div
              className="w-full h-[120px] rounded-xl mb-6 overflow-hidden relative"
              style={{
                background: `linear-gradient(180deg, rgba(15,94,255,0.2) 0%, rgba(56,189,248,0.05) 100%)`,
              }}
            >
              <svg viewBox="0 0 800 120" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={ROYAL} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={ROYAL} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 C80,85 120,70 200,60 C280,50 320,75 400,55 C480,35 520,50 600,30 C680,10 740,25 800,15 L800,120 L0,120 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M0,90 C80,85 120,70 200,60 C280,50 320,75 400,55 C480,35 520,50 600,30 C680,10 740,25 800,15"
                  fill="none"
                  stroke={ELECTRIC}
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Open positions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3" style={{ color: SILVER }}>Open Positions</h4>
              <div className="grid gap-2">
                {[
                  { pair: 'BTC/USDT', type: 'Long', entry: '$65,800', pnl: '+$1,445', positive: true },
                  { pair: 'ETH/USDT', type: 'Short', entry: '$3,520', pnl: '+$640', positive: true },
                ].map((pos) => (
                  <div
                    key={pos.pair}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: 'rgba(192,199,209,0.04)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${ROYAL}, ${ELECTRIC})` }}
                      >
                        <TrendingUp size={14} color={WHITE} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: WHITE }}>{pos.pair}</p>
                        <p className="text-xs" style={{ color: MUTED }}>{pos.type} &middot; Entry {pos.entry}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm" style={{ color: pos.positive ? GREEN : RED }}>
                      {pos.pnl}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => router.push('/signin')}
                className="px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF9F43)',
                  color: NAVY,
                  boxShadow: '0 0 25px rgba(255,215,0,0.25)',
                }}
              >
                View Live Dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ INVESTMENT PLANS ═══════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center"
            style={{ color: WHITE }}
            variants={fadeUp}
          >
            Investment Plans
          </motion.h2>
          <motion.p className="text-center mb-12 max-w-xl mx-auto" style={{ color: MUTED }} variants={fadeUp}>
            Choose the plan that matches your trading ambitions.
          </motion.p>

          <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <motion.div
              className="flex gap-5 min-w-max sm:min-w-0 pb-2"
              variants={fadeUpStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  className="w-[260px] sm:w-auto sm:flex-1 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:translate-y-[-4px] relative"
                  style={{
                    background: 'rgba(14, 34, 72, 0.5)',
                    backdropFilter: 'blur(16px)',
                    border: plan.popular ? `2px solid ${GOLD}` : '1px solid rgba(192,199,209,0.1)',
                  }}
                  variants={fadeUp}
                >
                  {plan.popular && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${ORANGE})`,
                        color: NAVY,
                      }}
                    >
                      POPULAR
                    </span>
                  )}

                  <h3 className="text-lg font-bold mb-1" style={{ color: WHITE }}>
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-extrabold mb-1" style={{ color: plan.popular ? GOLD : ELECTRIC }}>
                    {plan.price}
                  </p>
                  <p className="text-sm mb-5" style={{ color: MUTED }}>
                    {plan.returnRate} returns
                  </p>

                  <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm" style={{ color: SILVER }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: plan.popular ? GOLD : ROYAL }} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => router.push('/signin')}
                    className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: plan.popular
                        ? `linear-gradient(135deg, ${GOLD}, ${ORANGE})`
                        : `linear-gradient(135deg, ${ROYAL}, ${ELECTRIC})`,
                      color: plan.popular ? NAVY : WHITE,
                      boxShadow: plan.popular
                        ? '0 0 25px rgba(255,215,0,0.25)'
                        : '0 0 20px rgba(15,94,255,0.2)',
                    }}
                  >
                    Get Started
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer
        className="mt-auto w-full border-t"
        style={{ backgroundColor: '#060f20', borderColor: 'rgba(192,199,209,0.08)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="NexTrade Pro" width={36} height={36} />
                <span className="text-lg font-bold" style={{ color: WHITE }}>NexTrade Pro</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                Institutional-grade trading platform trusted by thousands of traders worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: SILVER }}>
                Quick Links
              </h4>
              <ul className="flex flex-col gap-2.5">
                {['About', 'Markets', 'Trading', 'Support', 'Legal'].map((link) => (
                  <li key={link}>
                    <span
                      className="text-sm cursor-pointer transition-colors duration-200 hover:underline"
                      style={{ color: MUTED }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download */}
            <div className="sm:col-span-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: SILVER }}>
                Download App
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(14, 34, 72, 0.6)',
                    border: '1px solid rgba(192,199,209,0.1)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.5 13.11l2.198-2.602zM5.864 2.658L16.8 8.99l-2.302 2.303-8.634-8.635z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-none" style={{ color: MUTED }}>GET IT ON</p>
                    <p className="text-sm font-semibold" style={{ color: WHITE }}>Google Play</p>
                  </div>
                </button>
                <button
                  className="flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(14, 34, 72, 0.6)',
                    border: '1px solid rgba(192,199,209,0.1)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-none" style={{ color: MUTED }}>Download on the</p>
                    <p className="text-sm font-semibold" style={{ color: WHITE }}>App Store</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6 border-t text-center"
            style={{ borderColor: 'rgba(192,199,209,0.08)' }}
          >
            <p className="text-xs" style={{ color: MUTED }}>
              &copy; {new Date().getFullYear()} NexTrade Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
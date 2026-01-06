
import React from 'react';

export const APP_NAME = "LoopRewards";
export const CURRENCY_SYMBOL = "₦";
export const ADMIN_EMAIL = "youngstoic11@gmail.com";
export const ADMIN_PASSWORD = "Nosayi17$";

export const SUPPORT_AGENT = {
  handle: "@youngstoic",
  name: "Lawrence Martin",
  role: "Chief Concierge & Support Lead",
  avatar: "👨‍💼",
  status: "Online • Protocol Active"
};

export const BANKS = [
  { id: '1', name: 'Access Bank', code: '044' },
  { id: '2', name: 'First Bank', code: '011' },
  { id: '3', name: 'GTBank', code: '058' },
  { id: '4', name: 'UBA', code: '033' },
  { id: '5', name: 'Zenith Bank', code: '057' },
  { id: '6', name: 'Kuda Bank', code: '50211' },
  { id: '7', name: 'OPay', code: '999992' },
  { id: '8', name: 'PalmPay', code: '999991' },
  { id: '9', name: 'Moniepoint', code: '50515' },
];

export const PREMIUM_BENEFITS = [
  { title: "5.0x Multiplier", desc: "Elite nodes yield maximum liquidity.", icon: "🚀" },
  { title: "Direct Line to Support", desc: "Priority handshake with @youngstoic.", icon: "🛡️" },
  { title: "Instant Settle", desc: "Skip standard 24-hour audit cycles.", icon: "⚡" },
  { title: "Institutional Badge", desc: "Diamond-level status on all protocols.", icon: "💎" },
];

export const Icons = {
  Wallet: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  ),
  Shield: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Concierge: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 18h20" /><path d="M5 18v-4a7 7 0 0 1 14 0v4" /><path d="M12 10V7" /><circle cx="12" cy="5" r="2" />
    </svg>
  )
};

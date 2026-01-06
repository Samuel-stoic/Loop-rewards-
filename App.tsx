
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { User, Wallet, SubscriptionTier, UserRole, Transaction } from './types';
import { ApiService } from './services/api';
import { BANKS, APP_NAME, SUPPORT_AGENT, CURRENCY_SYMBOL, PREMIUM_BENEFITS } from './constants.tsx';

type View = 'LANDING' | 'LOGIN' | 'SIGNUP' | 'OTP' | 'DASHBOARD' | 'TASKS' | 'WITHDRAW' | 'PREMIUM' | 'ADMIN' | 'SUPPORT';

interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  transactions: Transaction[];
  view: View;
  setView: (v: View) => void;
  refresh: () => Promise<void>;
  setUser: (u: User | null) => void;
  notify: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => useContext(AuthContext)!;

// --- COMPONENTS ---

const Notification = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-sm bg-indigo-950 text-white p-6 rounded-[2.5rem] shadow-4xl flex items-center justify-between border border-white/10 animate-slide-down">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-xl">🔔</div>
      <p className="text-sm font-bold">{message}</p>
    </div>
    <button onClick={onClose} className="opacity-40 text-2xl hover:opacity-100 transition-opacity">×</button>
  </div>
);

const Navbar = () => {
  const { user, setView, setUser } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-3xl z-[500] border-b border-gray-100 px-6 py-6 flex justify-between items-center">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('LANDING')}>
        <div className="w-10 h-10 bg-indigo-950 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-xl">LR</div>
        <span className="text-lg font-black text-indigo-950 tracking-tighter">{APP_NAME}</span>
      </div>
      <div className="flex items-center space-x-3">
        {user ? (
          <>
            <button onClick={() => setView('SUPPORT')} className="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-xl text-indigo-950 hover:bg-indigo-100 transition-all">👨‍💼</button>
            <button onClick={() => { sessionStorage.clear(); setUser(null); setView('LANDING'); }} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-lg hover:bg-red-50 hover:text-red-500 transition-all">🚪</button>
          </>
        ) : (
          <button onClick={() => setView('LOGIN')} className="px-6 py-2.5 bg-indigo-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 active:scale-95 transition-all">Vault Login</button>
        )}
      </div>
    </nav>
  );
};

const TabBar = () => {
  const { view, setView } = useAuth();
  const tabs = [
    { id: 'DASHBOARD', icon: '🏛️', label: 'Vault' },
    { id: 'TASKS', icon: '🎯', label: 'Yield' },
    { id: 'PREMIUM', icon: '💎', label: 'Elite' },
    { id: 'WITHDRAW', icon: '💸', label: 'Payout' },
  ];
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/90 backdrop-blur-3xl border border-gray-200 rounded-[3.5rem] p-2 flex justify-between shadow-4xl z-[600]">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setView(tab.id as any)} className={`flex-1 py-4 rounded-[3rem] flex flex-col items-center transition-all ${view === tab.id ? 'bg-indigo-950 text-white scale-105 shadow-2xl' : 'text-gray-400 hover:text-indigo-950'}`}>
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- VIEWS ---

const DashboardView = () => {
  const { user, wallet, transactions, notify, setView, refresh } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || !wallet) return null;

  const handleCoupon = async () => {
    if (!coupon) return;
    setLoading(true);
    const res = await ApiService.redeemCoupon(user.id, coupon);
    if (res.success) {
      notify(`SUCCESS: Voucher applied. +${CURRENCY_SYMBOL}${res.data} added.`);
      setCoupon('');
      await refresh();
    } else notify(res.error || "Rejection.");
    setLoading(false);
  };

  const copyRef = () => {
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${user.referralCode}`);
    notify("REF PROTOCOL: Portal link copied.");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pt-32 space-y-12 pb-44 animate-scale-up">
       <header className="flex justify-between items-end px-4">
          <div>
             <h1 className="text-5xl font-black text-indigo-950 tracking-tighter">Vault</h1>
             <p className="text-gray-400 font-medium text-sm mt-2">Node ID: <span className="font-black text-indigo-950 tracking-widest">{user.accountNumber}</span></p>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center space-x-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-[10px] font-black uppercase text-indigo-950 tracking-widest">{user.tier} PORTAL</span>
          </div>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 p-14 bg-[#0A0D14] rounded-[5rem] text-white shadow-4xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-14 opacity-[0.03] text-9xl">🏛️</div>
             <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">Total Liquidity</p>
             <h2 className="text-8xl font-black tracking-tighter mb-24">{CURRENCY_SYMBOL}{wallet.balance.toLocaleString()}</h2>
             <div className="flex space-x-6">
                <button onClick={() => setView('TASKS')} className="flex-1 py-7 bg-white text-indigo-950 rounded-[3rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-4xl active:scale-95 transition-all">Engage Yield</button>
                <button onClick={() => setView('WITHDRAW')} className="flex-1 py-7 bg-white/5 text-white rounded-[3rem] font-black text-[11px] uppercase tracking-[0.4em] border border-white/10 backdrop-blur-3xl hover:bg-white/10 active:scale-95 transition-all">Disburse</button>
             </div>
          </div>

          <div className="bg-white p-14 rounded-[5rem] border border-gray-100 shadow-2xl flex flex-col justify-between items-center text-center">
             <div>
                <div className="w-20 h-20 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-4xl mb-10 mx-auto shadow-inner">⚜️</div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Protocol Pts</p>
                <h3 className="text-5xl font-black text-indigo-950 tracking-tighter">{wallet.points.toLocaleString()}</h3>
             </div>
             <button onClick={() => setView('PREMIUM')} className="w-full py-5 bg-indigo-50 text-indigo-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all">Elevate Rank</button>
          </div>
       </div>

       {/* VOUCHER & REF SECTION */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
          <div className="bg-white p-12 rounded-[4.5rem] border border-gray-100 shadow-xl space-y-6">
             <h4 className="text-2xl font-black text-indigo-950 tracking-tight">Voucher Protocol</h4>
             <div className="flex items-center bg-gray-50 rounded-[2rem] border border-gray-100 focus-within:border-indigo-950 transition-all p-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value)} type="text" placeholder="ENTER CODE" className="flex-1 bg-transparent px-6 font-black text-lg outline-none uppercase placeholder:text-gray-300" />
                <button onClick={handleCoupon} disabled={loading || !coupon} className="px-8 py-5 bg-indigo-950 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-30">Redeem</button>
             </div>
          </div>
          <div className="bg-indigo-950 p-12 rounded-[4.5rem] text-white shadow-2xl flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute -bottom-10 -right-10 text-9xl opacity-[0.05] group-hover:rotate-12 transition-transform">🎁</div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300 mb-2">Referral Engine</p>
             <h4 className="text-3xl font-black tracking-tighter mb-6">Earn {CURRENCY_SYMBOL}500 instantly</h4>
             <button onClick={copyRef} className="w-max px-10 py-5 bg-white text-indigo-950 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all">Copy Portal Link</button>
          </div>
       </div>

       <div className="space-y-10">
          <h3 className="text-3xl font-black text-indigo-950 tracking-tighter px-4 leading-none">Audit Ledger</h3>
          <div className="bg-white rounded-[5rem] border border-gray-100 shadow-2xl overflow-hidden divide-y divide-gray-50">
             {transactions.length > 0 ? transactions.map(tx => (
                <div key={tx.id} className="p-12 flex justify-between items-center hover:bg-gray-50/80 transition-all cursor-default group">
                   <div className="flex items-center space-x-8">
                      <div className="w-16 h-16 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-3xl shadow-sm group-hover:bg-white transition-colors">
                        {tx.type === 'CONVERSION' ? '🎫' : tx.type === 'TASK_REWARD' ? '🎯' : '💎'}
                      </div>
                      <div>
                         <p className="font-black text-indigo-950 text-xl tracking-tight leading-none">{tx.description}</p>
                         <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-2">{new Date(tx.createdAt).toLocaleDateString()} • SECURE</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-indigo-950 text-2xl">+{CURRENCY_SYMBOL}{tx.amount.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mt-1">Settled</p>
                   </div>
                </div>
             )) : (
                <div className="p-32 text-center text-gray-200 font-black uppercase tracking-[0.5em] text-sm">Ledger Clean</div>
             )}
          </div>
       </div>
    </div>
  );
};

const SupportView = () => {
    const { user, notify } = useAuth();
    const [msg, setMsg] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        if (!msg) return;
        setSent(true);
        setTimeout(() => {
            notify("CONCIERGE: Protocol received. Nosayi will respond shortly.");
            setMsg('');
            setSent(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pt-40 pb-44 animate-scale-up space-y-14">
            <div className="text-center space-y-4">
                <span className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-[0.6em] border border-indigo-100">Protocol Support</span>
                <h1 className="text-6xl font-black text-indigo-950 tracking-tighter">Support Protocol</h1>
            </div>

            <div className="bg-white p-16 rounded-[6rem] shadow-5xl border border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-10">
                    <div className="flex items-center space-x-8">
                        <div className="w-24 h-24 bg-indigo-950 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl">{SUPPORT_AGENT.avatar}</div>
                        <div>
                            <h3 className="text-3xl font-black text-indigo-950 tracking-tight leading-none">{SUPPORT_AGENT.name}</h3>
                            <p className="text-indigo-600 font-black text-[11px] uppercase mt-2 tracking-widest">{SUPPORT_AGENT.handle}</p>
                        </div>
                    </div>
                    <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 space-y-4">
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Agent Role</p>
                        <p className="text-indigo-950 font-medium text-lg leading-relaxed">{SUPPORT_AGENT.role}</p>
                        <div className="flex items-center space-x-3">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[11px] font-black uppercase text-green-600 tracking-widest">{SUPPORT_AGENT.status}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 flex flex-col justify-center">
                    <h4 className="text-2xl font-black text-indigo-950 tracking-tighter">Direct Command Line</h4>
                    <textarea 
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        placeholder="State your protocol requirement..." 
                        className="w-full h-48 bg-gray-50 p-8 rounded-[3.5rem] border border-gray-100 focus:border-indigo-950 outline-none font-medium text-lg transition-all"
                    ></textarea>
                    <button onClick={handleSend} disabled={sent || !msg} className="w-full py-9 bg-indigo-950 text-white rounded-[3.5rem] font-black text-xl shadow-4xl active:scale-95 transition-all">
                        {sent ? 'DISPATCHING...' : 'INITIATE CONTACT'}
                    </button>
                </div>
            </div>

            <div className="bg-indigo-50/50 p-12 rounded-[5rem] border border-indigo-100 text-center">
                <p className="text-indigo-950 font-black tracking-tight text-xl mb-4">Official Channels</p>
                <div className="flex justify-center space-x-10">
                    <a href="https://t.me/youngstoic" target="_blank" className="text-indigo-600 font-black uppercase tracking-[0.2em] hover:text-indigo-950 transition-colors">Telegram Protocol</a>
                    <a href="mailto:support@looprewards.co" className="text-indigo-600 font-black uppercase tracking-[0.2em] hover:text-indigo-950 transition-colors">Identity Mail</a>
                </div>
            </div>
        </div>
    );
};

const SettlementView = () => {
    const { wallet, notify } = useAuth();
    const [accountNo, setAccountNo] = useState('');
    const [bank, setBank] = useState(BANKS[0].id);
    const [accountName, setAccountName] = useState('');
    const [resolving, setResolving] = useState(false);
    const [amt, setAmt] = useState('');

    useEffect(() => {
        if (accountNo.length >= 10) {
            setResolving(true);
            setAccountName('');
            ApiService.resolveAccountName(bank, accountNo).then(res => {
                if (res.success) setAccountName(res.data!);
                setResolving(false);
            });
        } else setAccountName('');
    }, [accountNo, bank]);

    const handleWithdraw = () => {
        if (Number(amt) > (wallet?.balance || 0)) return notify("ERROR: Insufficient liquidity.");
        notify(`REQUEST LOGGED: ₦${amt} scheduled for audit. Reference: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
        setAmt('');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 pt-40 space-y-14 pb-44 animate-scale-up">
            <h1 className="text-7xl font-black text-indigo-950 tracking-tighter px-4 leading-[0.8]">Protocol <br/> <span className="text-indigo-600">Settle.</span></h1>
            <div className="bg-white p-16 rounded-[6rem] shadow-5xl space-y-12 border border-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-950"></div>
                
                <div className="space-y-8">
                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.5em] block mb-4">Target Bank Node</label>
                        <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full bg-transparent font-black outline-none cursor-pointer text-xl">
                            {BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.5em] block mb-4">Account ID</label>
                        <input maxLength={11} type="text" value={accountNo} onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))} className="w-full bg-transparent font-black text-3xl outline-none" placeholder="0000000000" />
                    </div>
                </div>
                
                <div className={`transition-all duration-700 overflow-hidden ${accountNo.length >= 10 ? 'max-h-36 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-indigo-950 p-10 rounded-[3.5rem] shadow-2xl text-center border border-white/10">
                        <label className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em] block mb-3">Identity Resolved</label>
                        <div className="flex items-center justify-center space-x-3 h-8">
                            {resolving ? (
                                <div className="flex space-x-2 py-1">
                                    {[1,2,3].map(i => <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: `${i*100}ms`}}></div>)}
                                </div>
                            ) : (
                                <p className="text-white font-black text-2xl tracking-tight uppercase">{accountName || 'INVALID NODE'}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50/60 p-12 rounded-[4rem] text-center border border-indigo-100 shadow-inner">
                    <label className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.6em] block mb-6">Disbursement Amount ({CURRENCY_SYMBOL})</label>
                    <input type="number" value={amt} onChange={e => setAmt(e.target.value)} className="w-full bg-transparent font-black text-8xl text-indigo-950 outline-none text-center" placeholder="0.00" />
                </div>
                
                <button onClick={handleWithdraw} disabled={resolving || !accountName || !amt} className="w-full py-10 bg-indigo-950 text-white rounded-[4rem] font-black text-2xl shadow-4xl active:scale-95 transition-all disabled:opacity-30">INITIATE DISBURSEMENT</button>
            </div>
        </div>
    );
};

// --- CORE WRAPPER ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<View>('LANDING');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) sessionStorage.setItem('lr_temp_ref', ref);

    const s = sessionStorage.getItem('lr_session');
    if (s) {
       const p = JSON.parse(s);
       setUser(p);
       refreshInternal(p.id);
       setView('DASHBOARD');
    }
  }, []);

  const refreshInternal = async (uid: string) => {
     const res = await ApiService.getDashboard(uid);
     if (res.success && res.data) {
        setWallet(res.data.wallet);
        setUser(res.data.user);
        setTransactions(res.data.transactions || []);
     }
  };

  const refresh = async () => { if (user) await refreshInternal(user.id); };
  const notify = (msg: string) => setNotification(msg);

  return (
    <AuthContext.Provider value={{ user, wallet, transactions, view, setView, refresh, setUser, notify }}>
      <div className="min-h-screen bg-[#FBFBFE] font-['Inter'] selection:bg-indigo-100 overflow-x-hidden">
        <Navbar />
        {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
        
        <main className="pb-44">
           {view === 'LANDING' && (
             <div className="max-w-6xl mx-auto px-6 pt-56 text-center animate-scale-up">
                <span className="px-6 py-3 bg-indigo-50 text-indigo-950 rounded-full text-[11px] font-black uppercase tracking-[0.5em] mb-16 inline-block border border-indigo-100 shadow-sm">Verified Settlement Protocol</span>
                <h1 className="text-[10rem] font-black tracking-tighter mt-5 leading-[0.75] text-indigo-950">Yield on <br/> <span className="text-indigo-600">Attention.</span></h1>
                <p className="text-3xl text-gray-500 mt-20 max-w-3xl mx-auto font-medium leading-relaxed">Engagement as an institutional asset class. Secure, audited verified settlement into your node instantly.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-10 mt-28">
                   <button onClick={() => setView('SIGNUP')} className="px-20 py-10 bg-indigo-950 text-white rounded-[3.5rem] font-black text-2xl shadow-4xl hover:scale-105 active:scale-95 transition-all">START PROTOCOL</button>
                   <button onClick={() => setView('LOGIN')} className="px-20 py-10 bg-white border-2 border-gray-100 rounded-[3.5rem] font-black text-2xl text-gray-600 active:scale-95 transition-all shadow-sm">ACCESS PORTAL</button>
                </div>
             </div>
           )}

           {view === 'SIGNUP' && (
             <div className="max-w-lg mx-auto mt-40 p-16 bg-white rounded-[5rem] shadow-5xl border border-gray-100 animate-scale-up">
                <h2 className="text-4xl font-black text-indigo-950 mb-14 tracking-tighter leading-none">Establish Portal</h2>
                <form onSubmit={async e => {
                   e.preventDefault();
                   const res = await ApiService.signup((e.target as any).email.value, (e.target as any).password.value, (e.target as any).ref.value);
                   if (res.success) setView('OTP');
                   else alert(res.error);
                }} className="space-y-10">
                   <div className="bg-gray-50 p-9 rounded-[2.5rem] border border-gray-100 focus-within:border-indigo-950 transition-all">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Primary Email</label>
                      <input required name="email" type="email" placeholder="client@looprewards.co" className="w-full bg-transparent font-black text-2xl outline-none" />
                   </div>
                   <div className="bg-gray-50 p-9 rounded-[2.5rem] border border-gray-100 focus-within:border-indigo-950 transition-all">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Vault Password</label>
                      <input required name="password" type="password" placeholder="••••••••" className="w-full bg-transparent font-black text-2xl outline-none" />
                   </div>
                   <div className="bg-gray-50 p-9 rounded-[2.5rem] border border-gray-100 focus-within:border-indigo-950 transition-all">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Referral ID (Optional)</label>
                      <input name="ref" defaultValue={sessionStorage.getItem('lr_temp_ref') || ''} type="text" placeholder="CODE" className="w-full bg-transparent font-black text-2xl outline-none uppercase" />
                   </div>
                   <button className="w-full py-9 bg-indigo-950 text-white rounded-[3.5rem] font-black text-2xl shadow-4xl mt-6 active:scale-95 transition-all">ESTABLISH PORTAL</button>
                </form>
             </div>
           )}

           {view === 'LOGIN' && (
             <div className="max-w-lg mx-auto mt-40 p-16 bg-white rounded-[5rem] shadow-5xl border border-gray-100 text-center animate-scale-up">
                <div className="w-32 h-32 bg-indigo-950 rounded-[4rem] flex items-center justify-center text-white text-6xl font-black mx-auto mb-16 shadow-2xl">L</div>
                <h2 className="text-5xl font-black text-indigo-950 tracking-tighter mb-16">Loop Portal</h2>
                <form onSubmit={async e => {
                   e.preventDefault();
                   const res = await ApiService.login((e.target as any).email.value, (e.target as any).password.value);
                   if (res.success && res.data) {
                      setUser(res.data);
                      await refreshInternal(res.data.id);
                      setView('DASHBOARD');
                   } else alert(res.error || "Vault access denied.");
                }} className="space-y-8">
                   <input required name="email" type="email" placeholder="Email Address" className="w-full p-9 bg-gray-50 rounded-[2.8rem] font-bold outline-none border border-transparent focus:border-indigo-950 transition-all text-xl shadow-inner" />
                   <input required name="password" type="password" placeholder="Vault Password" className="w-full p-9 bg-gray-50 rounded-[2.8rem] font-bold outline-none border border-transparent focus:border-indigo-950 transition-all text-xl shadow-inner" />
                   <button className="w-full py-9 bg-indigo-950 text-white rounded-[3.8rem] font-black text-2xl shadow-4xl mt-6 active:scale-95 transition-all">ENTER VAULT</button>
                </form>
                <button onClick={() => setView('SIGNUP')} className="mt-16 text-[11px] font-black text-indigo-600 uppercase tracking-[0.5em] underline decoration-2 underline-offset-8 hover:text-indigo-950 transition-colors">Establish new identity</button>
             </div>
           )}

           {view === 'OTP' && (
             <div className="max-w-lg mx-auto mt-40 p-16 bg-white rounded-[5rem] shadow-5xl border border-gray-100 text-center animate-scale-up">
                <div className="w-28 h-28 bg-indigo-50 rounded-[3.5rem] flex items-center justify-center mx-auto mb-12 text-5xl shadow-inner">🛡️</div>
                <h2 className="text-4xl font-black text-indigo-950 mb-4 tracking-tighter">Shield Check</h2>
                <p className="text-gray-400 font-medium mb-16 text-lg">Confirm identity sequence to open vault access.</p>
                <input type="text" maxLength={6} className="w-full p-10 bg-gray-50 rounded-[3.2rem] text-center text-7xl font-black tracking-[0.6em] mb-14 outline-none border border-transparent focus:border-indigo-950 shadow-inner" onChange={async (e) => {
                    if(e.target.value.length === 6) {
                        const res = await ApiService.verifyOtp(e.target.value);
                        if(res.success && res.data) {
                            setUser(res.data);
                            sessionStorage.setItem('lr_session', JSON.stringify(res.data));
                            await refreshInternal(res.data.id);
                            setView('DASHBOARD');
                        } else alert("Invalid sequence.");
                    }
                }} />
                <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] opacity-40">(Identity Check Bypass: Check Alerts)</p>
             </div>
           )}

           {view === 'DASHBOARD' && <DashboardView />}
           {view === 'SUPPORT' && <SupportView />}
           {view === 'WITHDRAW' && <SettlementView />}
           
           {view === 'TASKS' && (
             <div className="max-w-6xl mx-auto p-6 pt-32 space-y-20 pb-44 animate-scale-up">
                <h1 className="text-8xl font-black text-indigo-950 tracking-tighter leading-[0.8] px-4">Yield <br/> <span className="text-indigo-600">Protocols.</span></h1>
                <div className="grid gap-14 px-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="bg-white p-14 rounded-[6rem] border border-gray-100 shadow-4xl flex flex-col sm:flex-row justify-between items-center gap-14 group cursor-pointer hover:shadow-5xl transition-all">
                        <div className="flex items-center space-x-14 w-full">
                           <div className="w-44 h-44 bg-indigo-50 rounded-[4.5rem] flex items-center justify-center text-7xl shadow-inner group-hover:bg-white transition-colors">🎯</div>
                           <div>
                              <p className="text-4xl font-black text-indigo-950 tracking-tight leading-none">Yield Node #{i*33}</p>
                              <div className="flex items-center space-x-6 mt-6">
                                 <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-full uppercase tracking-[0.15em] border border-indigo-100 shadow-sm">Verified Node</span>
                                 <span className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em]">{CURRENCY_SYMBOL}{(i*750).toLocaleString()} Reward</span>
                              </div>
                           </div>
                        </div>
                        <button onClick={() => alert("Connecting to Identity Social Node...")} className="w-full sm:w-auto px-20 py-9 bg-indigo-950 text-white rounded-[3.5rem] font-black text-[13px] uppercase tracking-[0.5em] shadow-4xl hover:bg-black active:scale-95 transition-all">Start Node</button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {view === 'PREMIUM' && (
             <div className="max-w-7xl mx-auto p-6 pt-32 pb-44 animate-scale-up text-center">
                <header className="mb-32 space-y-8">
                  <span className="px-8 py-3 bg-indigo-50 text-indigo-600 rounded-full text-[12px] font-black uppercase tracking-[0.7em] border border-indigo-100">Elevation Hub</span>
                  <h1 className="text-9xl font-black text-indigo-950 tracking-tighter leading-[0.8]">Tier <br/> Elevation.</h1>
                  <p className="text-gray-400 font-medium max-w-2xl mx-auto text-2xl leading-relaxed mt-8">Institutional-grade multipliers for the elite engagement node.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
                  {[
                    {id: SubscriptionTier.GOLD, name: 'Loop Gold', price: 2500, mult: '1.5x', color: 'bg-white', text: 'text-indigo-950'},
                    {id: SubscriptionTier.ELITE, name: 'Loop Elite', price: 5000, mult: '2.5x', color: 'bg-indigo-950', text: 'text-white'},
                    {id: SubscriptionTier.PLATINUM, name: 'Loop Platinum', price: 10000, mult: '5.0x', color: 'bg-slate-900', text: 'text-white'},
                  ].map((t) => (
                    <div key={t.id} className={`p-16 rounded-[6.5rem] border shadow-4xl relative transition-all hover:-translate-y-6 ${t.color} ${t.text} ${user?.tier === t.id ? 'ring-[12px] ring-indigo-500/10 shadow-indigo-100' : 'border-gray-50'}`}>
                      <h3 className="text-4xl font-black mb-4 tracking-tight">{t.name}</h3>
                      <p className="text-7xl font-black tracking-tighter mb-16">{CURRENCY_SYMBOL}{t.price.toLocaleString()}<span className="text-xl opacity-30">/mo</span></p>
                      <div className="text-2xl font-black mb-16 uppercase tracking-[0.3em] bg-white/5 py-4 rounded-3xl">{t.mult} Multiplier</div>
                      <button onClick={async () => {
                         const res = await ApiService.upgradeTier(user!.id, t.id, t.price);
                         if(res.success) { refresh(); notify(`ELEVATION SUCCESS: Protocol upgraded to ${t.name}.`); } else notify(res.error || "Elevation Rejected.");
                      }} className={`w-full py-9 rounded-[3.8rem] font-black text-[12px] uppercase tracking-[0.5em] shadow-2xl ${t.color === 'bg-white' ? 'bg-indigo-950 text-white' : 'bg-white text-indigo-950'}`}>ACTIVATE {t.id}</button>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {view === 'ADMIN' && (
             <div className="max-w-5xl mx-auto p-6 pt-32 space-y-16 pb-44 animate-scale-up">
                <div className="flex justify-between items-end px-4">
                    <h1 className="text-7xl font-black text-indigo-950 tracking-tighter">Command</h1>
                    <span className="text-[11px] font-black text-red-500 bg-red-50 px-6 py-3 rounded-full uppercase tracking-[0.3em] border border-red-100">Admin Authority</span>
                </div>
                
                <div className="bg-[#0A0D14] p-16 rounded-[6rem] text-white shadow-5xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 opacity-10 text-9xl">🛡️</div>
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.7em] mb-6">Central Reserve</p>
                    <h2 className="text-9xl font-black tracking-tighter leading-none">{CURRENCY_SYMBOL}{ApiService.getAdminStats().reserveBalance.toLocaleString()}</h2>
                </div>

                <div className="bg-white p-16 rounded-[6rem] border border-gray-100 shadow-4xl space-y-12">
                   <h3 className="text-4xl font-black text-indigo-950 tracking-tighter">Immediate Disbursement</h3>
                   <form onSubmit={async e => {
                      e.preventDefault();
                      const id = (e.target as any).identifier.value;
                      const amt = Number((e.target as any).amount.value);
                      const res = await ApiService.adminSendFunds(id, amt);
                      if (res.success) {
                         notify(`DISBURSED: Protocol dispatching funds to ${id}.`);
                         refresh();
                         (e.target as any).reset();
                      } else notify(res.error || "Rejected.");
                   }} className="space-y-10">
                      <div className="bg-gray-50 p-10 rounded-[3.2rem] border border-gray-100 focus-within:border-indigo-950 transition-all">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-5">Target Node (Email / ID)</label>
                         <input required name="identifier" type="text" placeholder="Recipient Identity" className="w-full bg-transparent font-black text-3xl outline-none" />
                      </div>
                      <div className="bg-gray-50 p-10 rounded-[3.2rem] border border-gray-100 focus-within:border-indigo-950 transition-all">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-5 text-center">Disbursement Value ({CURRENCY_SYMBOL})</label>
                         <input required name="amount" type="number" placeholder="0.00" className="w-full bg-transparent font-black text-8xl text-indigo-950 outline-none text-center" />
                      </div>
                      <button className="w-full py-11 bg-indigo-950 text-white rounded-[4.5rem] font-black text-2xl shadow-4xl active:scale-95 transition-all">EXECUTE DISBURSEMENT</button>
                   </form>
                </div>
             </div>
           )}
        </main>

        {user && <TabBar />}
      </div>
      <style>{`
        @keyframes slide-down {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes scale-up {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up { animation: scale-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .shadow-4xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.12); }
        .shadow-5xl { box-shadow: 0 60px 120px -30px rgba(0,0,0,0.18); }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </AuthContext.Provider>
  );
};

export default App;

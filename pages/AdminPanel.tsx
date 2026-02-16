
import React, { useState, useEffect } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { Users, Zap, ShieldCheck, ArrowRight, UserCheck, Phone, LogOut, RefreshCcw, Wifi, WifiOff, Gift, Sparkles } from 'lucide-react';
import { db, supabase } from '../database';

interface AdminPanelProps {
  lang: Language;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang, onLogout }) => {
  const strings = UI_STRINGS[lang];
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftTargetCode, setGiftTargetCode] = useState('');
  const [giftAmount, setGiftAmount] = useState<number>(0);
  const [status, setStatus] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const data = await db.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();

    if (supabase) {
      const channel = supabase
        .channel('admin-live-updates')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'users' },
          () => {
            loadUsers();
          }
        )
        .subscribe((status) => {
          setIsOnline(status === 'SUBSCRIBED');
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleGiftXP = async (e?: React.FormEvent, manualCode?: string, manualAmount?: number) => {
    if (e) e.preventDefault();
    
    const code = manualCode || giftTargetCode;
    const amount = manualAmount || giftAmount;

    if (!code.trim() || !amount || amount <= 0) return;
    
    setStatus(lang === 'uz' ? "Yuborilmoqda..." : "Sending...");
    
    const success = await db.giftXPByCode(code.trim(), amount);
    if (success) {
      setStatus(lang === 'uz' ? `⚡ ${amount} XP yuborildi!` : `⚡ ${amount} XP sent!`);
      if (!manualCode) {
        setGiftAmount(0);
        setGiftTargetCode('');
      }
      setTimeout(() => setStatus(''), 3000);
    } else {
      setStatus(lang === 'uz' ? "❌ Xatolik yuz berdi!" : "❌ Error occurred!");
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const quickGift = (userCode: string) => {
    const amount = window.prompt(lang === 'uz' ? "Qancha XP yubormoqchisiz?" : "How much XP to gift?", "500");
    if (amount && !isNaN(Number(amount))) {
      handleGiftXP(undefined, userCode, Number(amount));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 space-y-10 animate-in fade-in duration-500 pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow-xl">
                <ShieldCheck size={20} />
                <span className="font-black text-xs uppercase tracking-widest">{strings.adminPanel}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                {isOnline ? 'Live' : 'Offline'}
              </div>
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-slate-900">Control Center</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={loadUsers} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={onLogout} className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-sm text-slate-500 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center gap-3 shadow-sm">
            <LogOut size={18} /> {strings.logout}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
                    <Zap fill="white" size={24} />
                 </div>
                 <h2 className="text-2xl font-black">{strings.giftXp}</h2>
              </div>
              <form onSubmit={handleGiftXP} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">{strings.enterCode}</label>
                    <input type="text" required value={giftTargetCode} onChange={(e) => setGiftTargetCode(e.target.value)} placeholder="#12345678" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-500" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">{strings.amount}</label>
                    <input type="number" required value={giftAmount || ''} onChange={(e) => setGiftAmount(parseInt(e.target.value))} placeholder="1000" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-500" />
                 </div>
                 {status && <p className={`text-xs font-black text-center p-3 rounded-xl ${status.includes('⚡') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{status}</p>}
                 <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                    {strings.send} <ArrowRight size={20} />
                 </button>
              </form>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-8 flex items-center justify-between text-white">
                 <div className="flex items-center gap-4">
                    <Users className="text-emerald-400" />
                    <h2 className="text-xl md:text-2xl font-black">{strings.usersList}</h2>
                 </div>
                 <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{users.length} Users</div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-8 py-6">User / Code</th>
                          <th className="px-8 py-6">Credentials</th>
                          <th className="px-8 py-6">Stats</th>
                          <th className="px-8 py-6">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {users.map((u, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-6">
                                <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{u.fullName}</div>
                                <div className="text-xs font-mono font-black text-emerald-600">{u.userCode}</div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                   <UserCheck size={14} className="text-indigo-400" /> @{u.username}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                   <Phone size={14} className="text-indigo-400" /> {u.phone}
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-1.5">
                                   <Zap size={14} fill="#10b981" className="text-emerald-500" />
                                   <span className="font-black text-lg text-slate-800">{u.progress.xp}</span>
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase">LVL {u.progress.level}</div>
                             </td>
                             <td className="px-8 py-6">
                                <button 
                                  onClick={() => quickGift(u.userCode)}
                                  className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                                >
                                  <Gift size={16} /> Gift
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {(users.length === 0 && !loading) && <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest">No users found</div>}
                 {loading && <div className="py-20 text-center text-slate-300 animate-pulse font-black uppercase">Loading from Supabase...</div>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


import React, { useState, useEffect, useMemo } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { 
  Users, Zap, ShieldCheck, ArrowRight, UserCheck, Phone, 
  LogOut, RefreshCcw, Wifi, WifiOff, Gift, Sparkles, 
  Trash2, Search, Key, UserCircle, Fingerprint 
} from 'lucide-react';
import { db, supabase } from '../database';

interface AdminPanelProps {
  lang: Language;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang, onLogout }) => {
  const strings = UI_STRINGS[lang];
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
        .channel('admin-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, loadUsers)
        .subscribe((status) => setIsOnline(status === 'SUBSCRIBED'));
      return () => { supabase.removeChannel(channel); };
    }
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return users.filter(u => 
      u.fullName.toLowerCase().includes(q) || 
      u.username.toLowerCase().includes(q) || 
      u.userCode.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  }, [users, searchTerm]);

  const handleDeleteUser = async (user: User) => {
    const confirmMsg = lang === 'uz' 
      ? `Haqiqatdan ham ${user.fullName} (@${user.username}) ni butunlay o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!` 
      : `Are you sure you want to permanently delete ${user.fullName} (@${user.username})? This action cannot be undone!`;
    
    if (window.confirm(confirmMsg)) {
      const success = await db.deleteUser(user.username);
      if (success) {
        setStatus(lang === 'uz' ? "Foydalanuvchi o'chirildi" : "User deleted");
        loadUsers();
        setTimeout(() => setStatus(''), 3000);
      }
    }
  };

  const handleGiftXP = async (e?: React.FormEvent, manualCode?: string, manualAmount?: number) => {
    if (e) e.preventDefault();
    const code = manualCode || giftTargetCode;
    const amount = manualAmount || giftAmount;
    if (!code.trim() || !amount || amount <= 0) return;
    const success = await db.giftXPByCode(code.trim(), amount);
    if (success) {
      setStatus(lang === 'uz' ? `⚡ XP yuborildi!` : `⚡ XP sent!`);
      if (!manualCode) { setGiftAmount(0); setGiftTargetCode(''); }
      loadUsers();
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 space-y-8 animate-in fade-in duration-500 pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl shadow-xl">
                <ShieldCheck size={20} className="text-emerald-400" />
                <span className="font-black text-xs uppercase tracking-widest">Admin Control</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                {isOnline ? 'Live' : 'Offline'}
              </div>
           </div>
           <h1 className="text-3xl font-black text-slate-900">Platform Management</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={loadUsers} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm">
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={onLogout} className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg">
            <LogOut size={18} /> {strings.logout}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Search */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'uz' ? "Foydalanuvchini qidirish..." : "Search users..."}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 font-bold focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Total Users</span>
                  <span className="text-2xl font-black text-indigo-700">{users.length}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Gift size={16} className="text-amber-500" /> Fast Gift XP
                 </h3>
                 <form onSubmit={handleGiftXP} className="space-y-3">
                    <input type="text" required value={giftTargetCode} onChange={(e) => setGiftTargetCode(e.target.value)} placeholder="User ID Code" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-sm" />
                    <input type="number" required value={giftAmount || ''} onChange={(e) => setGiftAmount(parseInt(e.target.value))} placeholder="Amount (e.g. 500)" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-sm" />
                    <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg">Send XP</button>
                 </form>
              </div>
              {status && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-center font-black text-xs border border-emerald-100">{status}</div>}
           </div>
        </div>

        {/* Right Column: User Table */}
        <div className="lg:col-span-8">
           <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8 bg-slate-900 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Users className="text-emerald-400" />
                    <h2 className="text-xl font-black">Registered Database</h2>
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[800px]">
                    <thead>
                       <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-6 py-4">User Information</th>
                          <th className="px-6 py-4">Credentials</th>
                          <th className="px-6 py-4">Password</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {filteredUsers.map((u, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                      <UserCircle size={24} />
                                   </div>
                                   <div>
                                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{u.fullName}</div>
                                      <div className="text-[10px] font-mono font-black text-emerald-600 flex items-center gap-1">
                                         <Fingerprint size={10} /> {u.userCode}
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                                   <UserCheck size={12} className="text-indigo-400" /> @{u.username}
                                </div>
                                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                   <Phone size={12} /> {u.phone}
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg">
                                   <Key size={12} className="text-amber-500" />
                                   <code className="text-[11px] font-black text-amber-700 tracking-wider">{u.password}</code>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                   <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black">{u.progress.xp} XP</div>
                                   <div className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black">LVL {u.progress.level}</div>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center justify-center gap-2">
                                   <button 
                                      onClick={() => {
                                        const amt = prompt(lang === 'uz' ? "Qancha XP yubormoqchisiz?" : "Amount of XP:", "1000");
                                        if (amt) handleGiftXP(undefined, u.userCode, Number(amt));
                                      }}
                                      className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                      title="Gift XP"
                                   >
                                      <Gift size={18} />
                                   </button>
                                   <button 
                                      onClick={() => handleDeleteUser(u)}
                                      className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                      title="Delete Account"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {filteredUsers.length === 0 && (
                   <div className="py-20 text-center space-y-3">
                      <Search size={48} className="mx-auto text-slate-100" />
                      <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No matching users found</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

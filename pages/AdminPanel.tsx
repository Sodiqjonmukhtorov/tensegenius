
import React, { useState, useEffect, useMemo } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { 
  Users, ShieldCheck, LogOut, RefreshCcw, Wifi, WifiOff, 
  Gift, Trash2, Search, Key, UserCircle, Fingerprint, AtSign, Database, AlertTriangle, Settings, Check, X, Terminal, ExternalLink, Copy, Zap
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
  const [isGifting, setIsGifting] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState(100);
  const [showSetup, setShowSetup] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await db.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    
    // Real-time updates for Cloud Mode
    if (supabase) {
      const channel = supabase
        .channel('admin-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, loadUsers)
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } else {
      // Polling for Local Mode (to see changes if testing in multiple tabs)
      const interval = setInterval(loadUsers, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userCode.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const handleGiftXP = async (userCode: string) => {
    const success = await db.giftXPByCode(userCode, giftAmount);
    if (success) {
      setIsGifting(null);
      loadUsers();
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (window.confirm(lang === 'uz' ? `${username} o'chirilsinmi?` : `Delete ${username}?`)) {
      const success = await db.deleteUser(username);
      if (success) loadUsers();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Database size={120} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black">{strings.adminPanel}</h1>
            <div className="flex items-center gap-2 mt-0.5">
               <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${supabase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {supabase ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {supabase ? 'Cloud Sync Active' : 'Local Storage Mode'}
               </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={loadUsers}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
            title="Refresh"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setShowSetup(!showSetup)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
          >
            <Settings size={20} />
          </button>
          <button onClick={onLogout} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl transition-all font-black text-xs flex items-center gap-2 shadow-lg">
            <LogOut size={16} /> LEAVE
          </button>
        </div>
      </header>

      {/* Local Mode Warning - Very Prominent */}
      {!supabase && (
        <div className="bg-amber-50 border-4 border-amber-400 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl">
           <div className="w-20 h-20 bg-amber-400 rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0">
              <AlertTriangle size={40} />
           </div>
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-black text-amber-900 uppercase tracking-tight">Diqqat: Ma'lumotlar faqat shu qurilmada!</h2>
              <p className="text-amber-800 font-medium leading-relaxed">
                Hozirda bulutli baza (Supabase) ulanmagan. Boshqa telefonlardan ro'yxatdan o'tganlarni bu yerda ko'ra olmaysiz. 
                Hammani bitta joyda ko'rish uchun <b>Supabase</b> ulanishini sozlang.
              </p>
              <button 
                onClick={() => setShowSetup(true)}
                className="mt-2 text-indigo-600 font-black text-sm underline underline-offset-4 hover:text-indigo-800 transition-colors"
              >
                Qanday ulanadi? (Qo'llanmani ochish)
              </button>
           </div>
        </div>
      )}

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Ism, username yoki ID orqali qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-6 py-5 text-lg font-bold focus:outline-none focus:border-indigo-500 shadow-sm transition-all"
          />
        </div>
        <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl flex items-center justify-between group overflow-hidden relative">
           <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <Users size={120} />
           </div>
           <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Users</div>
              <div className="text-4xl font-black">{users.length}</div>
           </div>
           <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center relative z-10">
              <Users size={28} />
           </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ism-Familiya & ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username & Tel</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parol</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && users.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-[0.2em]">Bazaga ulanilmoqda...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center font-black text-slate-300">Ma'lumot topilmadi.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.username} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-inner">
                        <UserCircle size={24} />
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{user.fullName}</div>
                        <div className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-tighter">ID: {user.userCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                          <AtSign size={12} /> {user.username}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          {user.phone}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-mono font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 w-fit">
                       <Key size={12} /> {user.password}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black border border-emerald-100 flex items-center gap-1.5">
                         <Zap size={10} fill="currentColor" /> {user.progress.xp} XP
                      </div>
                      <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black border border-indigo-100">
                         LVL {user.progress.level}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isGifting === user.userCode ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                          <input 
                            type="number" 
                            value={giftAmount} 
                            onChange={(e) => setGiftAmount(Number(e.target.value))}
                            className="w-20 bg-white border-2 border-indigo-200 rounded-lg px-2 py-1.5 text-sm font-black focus:outline-none"
                          />
                          <button onClick={() => handleGiftXP(user.userCode)} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"><Check size={16} /></button>
                          <button onClick={() => setIsGifting(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg"><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => setIsGifting(user.userCode)} className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all border border-amber-100" title="XP Gift">
                            <Gift size={18} />
                          </button>
                          <button onClick={() => handleDeleteUser(user.username)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <Settings className="text-indigo-400" size={32} />
                    <h2 className="text-2xl font-black">Supabase Ulanish Qo'llanmasi</h2>
                 </div>
                 <button onClick={() => setShowSetup(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
              </div>
              <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
                 <div className="space-y-4">
                    <h3 className="font-black text-slate-800 flex items-center gap-2"><Terminal size={18} /> 1. Vercel / Muhit Kalitlari</h3>
                    <p className="text-sm text-slate-500">Agar Vercel-da bo'lsangiz, quyidagi kalitlarni qo'shib "Redeploy" qiling:</p>
                    <div className="bg-slate-900 p-6 rounded-2xl font-mono text-xs text-emerald-400 space-y-2">
                       <p>SUPABASE_URL = (Supabase Project URL)</p>
                       <p>SUPABASE_ANON_KEY = (Supabase Anon Key)</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="font-black text-slate-800 flex items-center gap-2"><Database size={18} /> 2. Bazada jadval yaratish</h3>
                    <p className="text-sm text-slate-500">Supabase SQL Editor-ga quyidagini kiriting:</p>
                    <button 
                      onClick={() => { navigator.clipboard.writeText("CREATE TABLE users (id BIGSERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, full_name TEXT NOT NULL, phone TEXT NOT NULL, user_code TEXT UNIQUE NOT NULL, progress JSONB, created_at TIMESTAMPTZ DEFAULT NOW());"); setCopiedSql(true); setTimeout(() => setCopiedSql(false), 2000); }}
                      className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 transition-all ${copiedSql ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {copiedSql ? <Check size={14} /> : <Copy size={14} />} {copiedSql ? 'Nusxalandi' : 'SQL-ni nusxalash'}
                    </button>
                 </div>

                 <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <p className="text-xs text-amber-800 font-medium"><b>Eslatma:</b> Kalitlar to'g'ri bo'lsa, Admin paneldagi sariq ogohlantirish o'rniga yashil "Cloud Sync Active" yozuvi paydo bo'ladi.</p>
                 </div>
                 
                 <a href="https://supabase.com/dashboard" target="_blank" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-center flex items-center justify-center gap-3 shadow-xl">
                    Supabase Dashboard-ni ochish <ExternalLink size={18} />
                 </a>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

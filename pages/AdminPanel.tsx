
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
  const [showSetup, setShowSetup] = useState(!supabase);
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
    
    if (supabase) {
      const channel = supabase
        .channel('admin-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, loadUsers)
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } else {
      window.addEventListener('storage_update', loadUsers);
      return () => window.removeEventListener('storage_update', loadUsers);
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
            className={`p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 ${loading ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            <RefreshCcw size={20} />
          </button>
          <button 
            onClick={() => setShowSetup(!showSetup)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
            title="Setup Settings"
          >
            <Settings size={20} />
          </button>
          <button onClick={onLogout} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl transition-all font-black text-xs flex items-center gap-2 shadow-lg">
            <LogOut size={16} /> LEAVE
          </button>
        </div>
      </header>

      {/* Cloud Connection Setup Guide (Faqat ulanmaganda ko'rinadi) */}
      {showSetup && (
        <div className="bg-white border-4 border-indigo-100 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-2xl animate-in zoom-in duration-300">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                    <Database size={32} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">Ulanishni yakunlash (Supabase)</h2>
                    <p className="text-slate-500 font-medium">Hammani bitta bazada ko'rish uchun quyidagilarni bajaring:</p>
                 </div>
              </div>
              <button onClick={() => setShowSetup(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="space-y-4">
                    <h3 className="font-black text-slate-800 flex items-center gap-2"><Terminal size={18} className="text-indigo-600" /> 1. Vercel-ga kalitlarni qo'shing</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Vercel Dashboard -> Settings -> Environment Variables bo'limiga o'tib, ushbu kalitlarni yozing va <b>Redeploy</b> qiling:</p>
                    <div className="bg-slate-900 p-6 rounded-2xl font-mono text-[11px] text-emerald-400 space-y-3 shadow-inner">
                       <div className="flex justify-between items-center group">
                          <span>SUPABASE_URL = https://nacqbacwqsxflxdelabd.supabase.co</span>
                          <button onClick={() => navigator.clipboard.writeText("https://nacqbacwqsxflxdelabd.supabase.co")} className="opacity-0 group-hover:opacity-100 text-[9px] bg-white/10 px-2 py-1 rounded">COPY</button>
                       </div>
                       <div className="flex justify-between items-center group">
                          <span>SUPABASE_ANON_KEY = sb_publishable_TmAypdRBAK9kDVmfd_f3gw_3Ll</span>
                          <button onClick={() => navigator.clipboard.writeText("sb_publishable_TmAypdRBAK9kDVmfd_f3gw_3Ll")} className="opacity-0 group-hover:opacity-100 text-[9px] bg-white/10 px-2 py-1 rounded">COPY</button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-4">
                    <h3 className="font-black text-slate-800 flex items-center gap-2"><Key size={18} className="text-indigo-600" /> 2. Bazada jadval bormi?</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Supabase SQL Editor bo'limida ushbu kodni bir marta ishga tushiring:</p>
                    <button 
                      onClick={() => { navigator.clipboard.writeText("CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, full_name TEXT NOT NULL, phone TEXT NOT NULL, user_code TEXT UNIQUE NOT NULL, progress JSONB DEFAULT '{\"xp\":0, \"level\":1, \"completedTenses\":[], \"unlockedTenses\":[\"pres-simple\"]}'::jsonb, created_at TIMESTAMPTZ DEFAULT NOW()); ALTER TABLE users ENABLE ROW LEVEL SECURITY; CREATE POLICY \"Allow all\" ON users FOR ALL USING (true) WITH CHECK (true);"); setCopiedSql(true); setTimeout(() => setCopiedSql(false), 2000); }}
                      className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-3 transition-all ${copiedSql ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {copiedSql ? <Check size={16} /> : <Copy size={16} />} 
                      {copiedSql ? 'SQL Nusxalandi!' : 'SQL Kodini nusxalash'}
                    </button>
                 </div>
                 
                 <a href="https://supabase.com/dashboard/project/nacqbacwqsxflxdelabd/sql" target="_blank" className="block w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-center text-sm shadow-xl hover:bg-indigo-700 transition-all">
                    Supabase SQL Editor-ni ochish <ExternalLink size={16} className="inline ml-1" />
                 </a>
              </div>
           </div>

           <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-100 flex items-start gap-4">
              <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={24} />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                 <b>Diqqat:</b> Agar siz hozir Vercel-ga kalitlarni qo'shmasangiz, foydalanuvchilar faqat o'zlari ro'yxatdan o'tgan qurilmadagina qoladi. Siz ularni bitta umumiy ro'yxatda ko'ra olmaysiz.
              </p>
           </div>
        </div>
      )}

      {/* Stats Cards */}
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
        <div className="bg-white rounded-[2rem] p-6 border-b-8 border border-slate-100 shadow-xl flex items-center justify-between group overflow-hidden relative">
           <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
              <Users size={100} />
           </div>
           <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Users</div>
              <div className="text-4xl font-black text-slate-900">{users.length}</div>
           </div>
           <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 relative z-10 shadow-inner">
              <Users size={28} />
           </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
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
    </div>
  );
};

export default AdminPanel;

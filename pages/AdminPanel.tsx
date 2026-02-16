
import React, { useState, useEffect, useMemo } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { 
  Users, ShieldCheck, LogOut, RefreshCcw, Wifi, WifiOff, 
  Gift, Trash2, Search, Key, UserCircle, Fingerprint, AtSign, Database, Settings, Check, X, Terminal, ExternalLink, Zap, Save, Download
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
  const [refreshStatus, setRefreshStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGifting, setIsGifting] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState(100);

  const loadUsers = async (isManual = false) => {
    if (isManual) setRefreshStatus('loading');
    setLoading(true);
    
    try {
      const data = await db.getAllUsers();
      setUsers(data);
      
      if (isManual) {
        setTimeout(() => {
          setRefreshStatus('success');
          setTimeout(() => setRefreshStatus('idle'), 1500);
        }, 600);
      }
    } catch (error) {
      console.error("Admin Load Error:", error);
      if (isManual) setRefreshStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    
    // 1. Cloud Real-time monitoring
    if (supabase) {
      const channel = supabase
        .channel('db-admin-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
          console.log("Cloud update detected...");
          loadUsers();
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } 
    
    // 2. Local Real-time (BroadcastChannel orqali)
    db.onSync((updatedUsers) => {
      console.log("Local broadcast update detected...");
      setUsers(updatedUsers);
    });

    // 3. Joriy oyna ichidagi event
    const handleLocalUpdate = () => {
      console.log("Local event update detected...");
      loadUsers();
    };
    window.addEventListener('local_db_update', handleLocalUpdate);
    
    return () => {
      window.removeEventListener('local_db_update', handleLocalUpdate);
    };
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
    if (window.confirm(lang === 'uz' ? `${username} o'chirilsinmi? Bu amalni ortga qaytarib bo'lmaydi!` : `Delete ${username}? This cannot be undone!`)) {
      const success = await db.deleteUser(username);
      if (success) loadUsers();
    }
  };

  const handleBackup = () => {
    db.exportData();
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
                  {supabase ? 'Cloud Persistence' : 'Local Persistence'}
               </div>
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-600/20 text-emerald-400">
                  <Save size={10} /> Data Integrity: 100%
               </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={handleBackup}
            title="Ma'lumotlarni yuklab olish (Backup)"
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 font-black text-[10px] uppercase"
          >
            <Download size={18} /> Backup
          </button>
          <button 
            onClick={() => loadUsers(true)}
            disabled={refreshStatus !== 'idle'}
            className={`p-3 rounded-xl transition-all border border-white/10 flex items-center justify-center min-w-[48px] ${
              refreshStatus === 'loading' ? 'bg-indigo-500/50 animate-pulse' : 
              refreshStatus === 'success' ? 'bg-emerald-500 text-white' : 
              'bg-white/10 hover:bg-white/20'
            }`}
          >
            {refreshStatus === 'loading' ? <RefreshCcw size={20} className="animate-spin" /> : 
             refreshStatus === 'success' ? <Check size={20} /> : 
             <RefreshCcw size={20} />}
          </button>
          <button onClick={onLogout} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl transition-all font-black text-xs flex items-center gap-2 shadow-lg active:scale-95">
            <LogOut size={16} /> {strings.logout}
          </button>
        </div>
      </header>

      {/* Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Ism, Username yoki ID orqali qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-6 py-5 text-lg font-bold focus:outline-none focus:border-indigo-500 shadow-sm transition-all"
          />
        </div>
        <div className="bg-white rounded-[2rem] p-6 border-b-8 border border-slate-100 shadow-xl flex items-center justify-between group">
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jami Ro'yxatdan O'tganlar</div>
              <div className="text-4xl font-black text-slate-900">{users.length}</div>
           </div>
           <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
              <Users size={28} />
           </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">O'quvchi Ma'lumotlari</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bog'lanish</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Xavfsizlik (Parol)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hozirgi Progress</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Boshqaruv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center space-y-4">
                     <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                     <p className="font-black text-slate-300 uppercase text-xs tracking-widest">Ma'lumotlar bazasidan o'qilmoqda...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center font-black text-slate-300">Hozircha hech qanday foydalanuvchi topilmadi.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.username} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shadow-inner">
                        <UserCircle size={24} />
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{user.fullName}</div>
                        <div className="text-[10px] font-mono font-black text-emerald-600 uppercase">ID: {user.userCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                       <AtSign size={12} /> {user.username}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{user.phone}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 w-fit">
                       <Key size={12} /> {user.password}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black border border-emerald-100 flex items-center gap-1.5 w-fit shadow-sm">
                       <Zap size={10} fill="currentColor" /> {user.progress.xp} XP
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setIsGifting(user.userCode)} 
                        title="Bonus XP sovg'a qilish"
                        className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Gift size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.username)} 
                        title="O'chirish (Diqqat!)"
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gift Modal */}
      {isGifting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl space-y-6 animate-in zoom-in">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <Gift size={32} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900">XP Sovg'a Qilish</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Foydalanuvchi ID: {isGifting}</p>
              </div>
              <input 
                type="number" 
                autoFocus
                value={giftAmount} 
                onChange={(e) => setGiftAmount(Number(e.target.value))} 
                className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl px-6 py-5 text-center text-3xl font-black text-indigo-600 focus:outline-none focus:border-indigo-500 transition-all" 
              />
              <div className="flex gap-4">
                 <button onClick={() => setIsGifting(null)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors">Bekor Qilish</button>
                 <button onClick={() => handleGiftXP(isGifting)} className="flex-1 bg-slate-900 text-white rounded-2xl font-black py-4 shadow-xl hover:bg-slate-800 active:scale-95 transition-all">YUBORISH</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

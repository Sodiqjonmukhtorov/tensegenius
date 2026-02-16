
import React, { useState, useEffect, useMemo } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { 
  Users, ShieldCheck, LogOut, RefreshCcw, Wifi, WifiOff, 
  Gift, Trash2, Search, Key, UserCircle, Fingerprint, AtSign, Database, Check, Zap, Save, Download, BellRing, Activity, AlertTriangle, ExternalLink
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
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  
  const [cloudStatus, setCloudStatus] = useState<{status: 'testing' | 'ok' | 'error' | 'none', msg: string}>({
    status: 'none',
    msg: ''
  });

  const checkCloud = async () => {
    setCloudStatus({ status: 'testing', msg: 'Ulanish tekshirilmoqda...' });
    const result = await db.testCloudConnection();
    setCloudStatus({ 
      status: result.success ? 'ok' : 'error', 
      msg: result.message 
    });
  };

  const loadUsers = async (isManual = false) => {
    if (isManual) setRefreshStatus('loading');
    setLoading(true);
    
    try {
      const data = await db.getAllUsers();
      if (users.length > 0 && data.length > users.length) {
        setLastNotification(lang === 'uz' ? "Yangi o'quvchi ro'yxatdan o'tdi!" : "New student registered!");
        setTimeout(() => setLastNotification(null), 5000);
      }
      setUsers(data);
      
      if (isManual) {
        setTimeout(() => {
          setRefreshStatus('success');
          setTimeout(() => setRefreshStatus('idle'), 1500);
        }, 600);
      }
    } catch (error) {
      if (isManual) setRefreshStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    checkCloud();
    
    if (supabase) {
      const channel = supabase.channel('realtime-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => loadUsers()).subscribe();
      return () => { supabase.removeChannel(channel); };
    } 
    
    db.onSync((updatedUsers) => {
      setUsers(updatedUsers);
      setLastNotification(lang === 'uz' ? "Baza yangilandi!" : "Database updated!");
      setTimeout(() => setLastNotification(null), 3000);
    });

    const handleUpdate = () => loadUsers();
    window.addEventListener('local_db_update', handleUpdate);
    return () => window.removeEventListener('local_db_update', handleUpdate);
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
    } else {
       alert("XP yuborishda xatolik. Cloud ulanishini tekshiring.");
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
      {/* Toast Notification */}
      {lastNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-3 animate-in slide-in-from-top-4">
           <BellRing className="animate-bounce" size={18} />
           {lastNotification}
        </div>
      )}

      {/* Admin Header */}
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
               <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cloudStatus.status === 'ok' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {cloudStatus.status === 'ok' ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {cloudStatus.status === 'ok' ? 'Cloud Connected' : 'Local Only'}
               </div>
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-600/20 text-indigo-400">
                  <Activity size={10} /> Real-time Monitoring
               </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={() => checkCloud()}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 flex items-center gap-2 font-black text-[10px] uppercase"
          >
            <Activity size={18} className={cloudStatus.status === 'testing' ? 'animate-spin' : ''} /> Test Cloud
          </button>
          <button 
            onClick={() => loadUsers(true)}
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

      {/* Cloud Error / Alert Section */}
      {cloudStatus.status !== 'ok' && cloudStatus.status !== 'testing' && (
        <div className="bg-rose-50 border-4 border-rose-100 p-8 rounded-[3rem] space-y-4 animate-in slide-in-from-top-4">
           <div className="flex items-center gap-4 text-rose-600">
              <AlertTriangle size={48} className="animate-pulse" />
              <div>
                 <h2 className="text-2xl font-black uppercase tracking-tight">Muhim: Bulutli Baza Ulanmagan!</h2>
                 <p className="font-bold text-rose-500/80">Foydalanuvchilar hozirda faqat ushbu brauzerda saqlanyapti.</p>
              </div>
           </div>
           
           <div className="bg-white/60 p-6 rounded-2xl border border-rose-100 space-y-3">
              <p className="text-sm font-bold text-slate-700">Sabab: <span className="text-rose-600 underline font-black">{cloudStatus.msg}</span></p>
              <div className="flex flex-wrap gap-4 pt-2">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase bg-slate-900 text-white px-3 py-1.5 rounded-lg">
                    1. Vercel-da kalitlarni tekshiring
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase bg-emerald-600 text-white px-3 py-1.5 rounded-lg">
                    2. Vercel-da "REDEPLOY" tugmasini bosing
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              <a 
                href="https://vercel.com/dashboard" 
                target="_blank" 
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl"
              >
                Vercel-ga o'tish <ExternalLink size={14} />
              </a>
              <button 
                onClick={checkCloud}
                className="bg-white border-2 border-slate-200 text-slate-900 px-6 py-4 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all"
              >
                Qayta tekshirish
              </button>
           </div>
        </div>
      )}

      {/* Cloud OK Status */}
      {cloudStatus.status === 'ok' && (
        <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold text-xs animate-in fade-in">
           <Check size={18} className="text-emerald-500" />
           Bulutli baza (Supabase) faol ishlayapti. Hamma ma'lumotlar xavfsiz saqlanmoqda.
        </div>
      )}

      {/* Stats and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Ism, username yoki ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-6 py-5 text-lg font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl flex items-center justify-between">
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Barcha o'quvchilar</div>
              <div className="text-4xl font-black text-slate-900">{users.length}</div>
           </div>
           <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Users size={28} />
           </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl flex items-center justify-between">
           <button onClick={() => db.exportData()} className="w-full h-full flex items-center justify-center gap-3 font-black text-slate-400 uppercase tracking-widest text-xs hover:text-indigo-600 transition-colors">
              <Download size={20} /> Backup (JSON)
           </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">O'quvchi</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aloqa</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parol</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">XP</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && users.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center font-black text-slate-300 animate-pulse">Ma'lumotlar yuklanmoqda...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center font-black text-slate-300">Hech kim topilmadi.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.username} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        <UserCircle size={24} />
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{user.fullName}</div>
                        <div className="text-[10px] font-mono font-black text-emerald-600">ID: {user.userCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5"><AtSign size={12} /> {user.username}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{user.phone}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 w-fit">
                       <Key size={12} /> {user.password}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black border border-emerald-100 flex items-center gap-1.5 w-fit">
                       <Zap size={10} fill="currentColor" /> {user.progress.xp}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setIsGifting(user.userCode)} className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                        <Gift size={18} />
                      </button>
                      <button onClick={() => handleDeleteUser(user.username)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
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
              <h3 className="text-xl font-black text-center text-slate-900">XP Sovg'a Qilish</h3>
              <input 
                type="number" 
                autoFocus
                value={giftAmount} 
                onChange={(e) => setGiftAmount(Number(e.target.value))} 
                className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl px-6 py-5 text-center text-3xl font-black text-indigo-600 focus:outline-none focus:border-indigo-500" 
              />
              <div className="flex gap-4">
                 <button onClick={() => setIsGifting(null)} className="flex-1 py-4 font-black text-slate-400">Bekor qilish</button>
                 <button onClick={() => handleGiftXP(isGifting)} className="flex-1 bg-slate-900 text-white rounded-2xl font-black py-4 shadow-xl">YUBORISH</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;


import React, { useState, useEffect, useMemo } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { 
  Users, ShieldCheck, UserCheck, Phone, LogOut, RefreshCcw, Wifi, WifiOff, 
  Gift, Trash2, Search, Key, UserCircle, Fingerprint, AtSign, Database, AlertTriangle
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
    const q = searchTerm.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u => 
      u.fullName.toLowerCase().includes(q) || 
      u.username.toLowerCase().includes(q) || 
      u.userCode.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  }, [users, searchTerm]);

  const handleDeleteUser = async (user: User) => {
    const confirmMsg = lang === 'uz' 
      ? `Haqiqatdan ham ${user.fullName} (@${user.username}) ni butunlay o'chirib tashlamoqchimisiz? Akkaunt o'chadi!` 
      : `Are you sure you want to delete ${user.fullName} (@${user.username}) permanently?`;
    
    if (window.confirm(confirmMsg)) {
      const success = await db.deleteUser(user.username);
      if (success) {
        setStatus(lang === 'uz' ? "O'chirildi" : "Deleted");
        loadUsers();
        setTimeout(() => setStatus(''), 3000);
      }
    }
  };

  const handleGiftXP = async (userCode: string) => {
    const amount = prompt(lang === 'uz' ? "Qancha XP yubormoqchisiz?" : "XP Amount:", "500");
    if (!amount || isNaN(Number(amount))) return;
    
    const success = await db.giftXPByCode(userCode, Number(amount));
    if (success) {
      setStatus("⚡ XP sent!");
      loadUsers();
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 space-y-8 pb-40 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
           <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-xl">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="font-black text-[10px] uppercase tracking-widest">Admin Control</span>
              </div>
              
              {/* Database Status Indicator */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${supabase ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <Database size={10} />
                {supabase ? 'Cloud Sync Active' : 'Local Storage Mode'}
              </div>

              {supabase && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isOnline ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}`}>
                  {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {isOnline ? 'Real-time' : 'Connecting'}
                </div>
              )}
           </div>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900">User Management</h1>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <button onClick={loadUsers} className="flex-1 md:flex-none p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm flex justify-center items-center">
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={onLogout} className="flex-[2] md:flex-none bg-rose-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg">
            <LogOut size={18} /> {strings.logout}
          </button>
        </div>
      </header>

      {/* Warning for Local Mode */}
      {!supabase && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-sm">
           <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <AlertTriangle size={24} />
           </div>
           <div className="space-y-1 text-center md:text-left">
              <h3 className="font-black text-amber-900">DIQQAT: Ma'lumotlar faqat shu qurilmada!</h3>
              <p className="text-sm text-amber-700 font-medium">
                Hozirda bulutli baza (Supabase) ulanmagan. Boshqa qurilmalardan ro'yxatdan o'tgan foydalanuvchilar bu yerda ko'rinmaydi. 
                Hammasini bitta joyda ko'rish uchun <b>Supabase</b>-ni sozlang.
              </p>
           </div>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'uz' ? "Ism, username yoki ID orqali qidirish..." : "Search by name, username or ID..."}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 font-bold focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <div className="bg-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Users size={24} />
            <span className="font-black text-xs uppercase tracking-widest">Total Users</span>
          </div>
          <span className="text-2xl font-black">{users.length}</span>
        </div>
      </div>

      {status && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl font-black text-center animate-bounce shadow-lg text-sm">
          {status}
        </div>
      )}

      {/* Main Table Content - Horizontal Scroll for Mobile */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-5">Ism-familiya & ID</th>
                <th className="px-6 py-5">Username & Tel</th>
                <th className="px-6 py-5">Parol</th>
                <th className="px-6 py-5">Progress</th>
                <th className="px-6 py-5 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
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
                      <AtSign size={12} className="text-indigo-400" /> {u.username}
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
                        onClick={() => handleGiftXP(u.userCode)}
                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Gift XP"
                      >
                        <Gift size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u)}
                        className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
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
              <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Foydalanuvchi topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

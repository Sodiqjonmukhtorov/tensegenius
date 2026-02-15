import React, { useState } from 'react';
import { Language, User } from '../types';
import { UI_STRINGS } from '../constants';
import { Users, Zap, ShieldCheck, Search, ArrowRight, UserCheck, Phone, LogOut } from 'lucide-react';

interface AdminPanelProps {
  lang: Language;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang, onLogout }) => {
  const strings = UI_STRINGS[lang];
  const [users, setUsers] = useState<User[]>(() => {
    const data = localStorage.getItem('tg_users');
    return data ? JSON.parse(data) : [];
  });

  const [giftTargetCode, setGiftTargetCode] = useState('');
  const [giftAmount, setGiftAmount] = useState<number>(0);
  const [status, setStatus] = useState('');

  const handleGiftXP = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    
    const targetIndex = users.findIndex(u => u.userCode === giftTargetCode);
    if (targetIndex >= 0) {
      const updatedUsers = [...users];
      updatedUsers[targetIndex].progress.xp += giftAmount;
      
      localStorage.setItem('tg_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setStatus(lang === 'uz' ? "XP muvaffaqiyatli yuborildi!" : "XP successfully sent!");
      setGiftAmount(0);
      setGiftTargetCode('');
    } else {
      setStatus(lang === 'uz' ? "Bunday kodli foydalanuvchi topilmadi!" : "User code not found!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow-xl">
             <ShieldCheck size={20} />
             <span className="font-black text-xs uppercase tracking-widest">{strings.adminPanel}</span>
           </div>
           <h1 className="text-4xl font-black text-slate-900">Control Center</h1>
        </div>
        <button 
          onClick={onLogout}
          className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-sm text-slate-500 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center gap-3 shadow-sm"
        >
          <LogOut size={18} />
          {strings.logout}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* XP Gifting Form */}
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
                    <input 
                      type="text" required value={giftTargetCode} 
                      onChange={(e) => setGiftTargetCode(e.target.value)}
                      placeholder="#12345678"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-500"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">{strings.amount}</label>
                    <input 
                      type="number" required value={giftAmount || ''} 
                      onChange={(e) => setGiftAmount(parseInt(e.target.value))}
                      placeholder="1000"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-500"
                    />
                 </div>
                 {status && <p className={`text-xs font-black text-center ${status.includes('muvaffaqiyatli') || status.includes('successfully') ? 'text-emerald-500' : 'text-rose-500'}`}>{status}</p>}
                 <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                    {strings.send} <ArrowRight size={20} />
                 </button>
              </form>
           </div>
        </div>

        {/* Users Database */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-8 flex items-center justify-between text-white">
                 <div className="flex items-center gap-4">
                    <Users className="text-emerald-400" />
                    <h2 className="text-2xl font-black">{strings.usersList}</h2>
                 </div>
                 <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{users.length} Users Found</div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-8 py-6">User / Code</th>
                          <th className="px-8 py-6">Credentials</th>
                          <th className="px-8 py-6">Stats</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {users.map((u, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-6">
                                <div className="font-black text-slate-900">{u.fullName}</div>
                                <div className="text-xs font-mono font-black text-emerald-600">{u.userCode}</div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                   <UserCheck size={14} className="text-indigo-400" /> @{u.username}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                   <Phone size={14} className="text-indigo-400" /> {u.phone}
                                </div>
                                <div className="text-[10px] font-mono text-slate-300">PASS: {u.password}</div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-1.5">
                                   <Zap size={14} fill="#10b981" className="text-emerald-500" />
                                   <span className="font-black text-lg text-slate-800">{u.progress.xp}</span>
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase">LVL {u.progress.level}</div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {users.length === 0 && (
                   <div className="py-20 text-center text-slate-300 font-black">DATABASE IS EMPTY</div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
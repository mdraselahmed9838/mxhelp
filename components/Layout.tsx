
import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, LogOut, BookOpenCheck, 
  Users, Clock, FileText, ShieldCheck, GraduationCap, Inbox
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { auth, logout, checkSuspension } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkSuspension();
  }, [location.pathname]);

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} />, roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.SUBSCRIBER] },
    { label: 'Database Audit', path: '/users', icon: <ShieldCheck size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Pending Apps', path: '/pending', icon: <Inbox size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Instructors', path: '/teachers', icon: <Users size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Student Body', path: '/students', icon: <GraduationCap size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Workstations', path: '/timeslots', icon: <Clock size={18} />, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r flex flex-col fixed inset-y-0 shadow-sm z-[100]">
        <div className="p-8 border-b flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
            <BookOpenCheck size={20} />
          </div>
          <span className="font-black text-lg uppercase tracking-tighter text-slate-800 leading-none">TrainSupport <span className="block text-blue-600 text-[10px]">Professional</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.filter(item => item.roles.includes(auth.user?.role as UserRole)).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className={location.pathname === item.path ? 'text-white' : 'text-slate-400'}>{item.icon}</div>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-4">
           <div className="px-4 py-3 bg-slate-50 rounded-2xl border">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Session Identity</p>
              <p className="text-xs font-bold text-slate-700 truncate">{auth.user?.fullName}</p>
              <p className="text-[9px] font-black text-blue-500 uppercase">{auth.user?.role}</p>
           </div>
          <button onClick={logout} className="flex items-center gap-3 w-full p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-black text-xs uppercase tracking-widest">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-10 min-h-screen bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
};

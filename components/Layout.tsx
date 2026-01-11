
import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, UserCircle, LogOut, BookOpenCheck, 
  Users, Clock, FileText, ShieldCheck, GraduationCap
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { auth, logout, checkSuspension } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkSuspension();
  }, [location.pathname]);

  const isAdmin = auth.user?.role === UserRole.ADMIN;

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} />, roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.SUBSCRIBER] },
    { label: 'User Listing', path: '/users', icon: <ShieldCheck size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Pending Apps', path: '/pending', icon: <FileText size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Teachers', path: '/teachers', icon: <Users size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Students', path: '/students', icon: <GraduationCap size={18} />, roles: [UserRole.ADMIN] },
    { label: 'Time Slots', path: '/timeslots', icon: <Clock size={18} />, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r flex flex-col fixed inset-y-0 shadow-sm">
        <div className="p-6 border-b flex items-center gap-2">
          <BookOpenCheck className="text-blue-600" />
          <span className="font-bold text-xl">TrainSupport</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.filter(item => item.roles.includes(auth.user?.role as UserRole)).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
           <div className="px-3 py-2">
              <p className="text-[10px] font-black uppercase text-slate-400">Current Session</p>
              <p className="text-xs font-bold text-slate-700 truncate">{auth.user?.email}</p>
           </div>
          <button onClick={logout} className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

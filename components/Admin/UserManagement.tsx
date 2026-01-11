
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole } from '../../types';
import { useAuth } from '../../App';
import { ShieldCheck, ShieldAlert, Key, Trash2, Search, Power, PowerOff, Lock } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => { refresh(); }, []);
  const refresh = () => setUsers(DB.getUsers());

  const filtered = users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleStatusToggle = (user: User) => {
    if (user.id === auth.user?.id) return alert("You cannot deactivate yourself.");
    const newState = !user.isBlocked;
    if (confirm(`Set ${user.fullName} to ${newState ? 'INACTIVE' : 'ACTIVE'}? Access will be ${newState ? 'revoked' : 'granted'} immediately.`)) {
      DB.updateUser(user.id, { isBlocked: newState });
      refresh();
    }
  };

  const handleRoleChange = (id: string, role: UserRole) => {
    if (id === auth.user?.id) return alert("Self-demotion is restricted.");
    DB.updateUser(id, { role });
    refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">User Listing & Control</h1>
      <div className="bg-white p-4 rounded-xl border flex items-center gap-4 shadow-sm">
        <Search className="text-slate-400" />
        <input className="flex-1 outline-none text-sm" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
            <tr>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(user => (
              <tr key={user.id} className={user.isBlocked ? 'opacity-50 grayscale bg-slate-50' : 'hover:bg-slate-50'}>
                <td className="p-4">
                  <div className="font-bold">{user.fullName}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </td>
                <td className="p-4">
                  <select className="border rounded px-2 py-1 text-xs" value={user.role} onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}>
                    <option value={UserRole.ADMIN}>ADMIN</option>
                    <option value={UserRole.STAFF}>STAFF</option>
                    <option value={UserRole.SUBSCRIBER}>SUBSCRIBER</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => handleStatusToggle(user)} className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.isBlocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {user.isBlocked ? <PowerOff size={12} /> : <Power size={12} />}
                    {user.isBlocked ? 'Inactive' : 'Active'}
                  </button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setPasswordTarget(user)} className="text-slate-400 hover:text-blue-600"><Key size={16} /></button>
                  <button onClick={() => { if(confirm('Delete permanently?')) { DB.deleteUser(user.id); refresh(); } }} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {passwordTarget && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Lock size={20}/> Reset Password</h3>
             <input className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password..." />
             <div className="flex gap-2">
                <button onClick={() => setPasswordTarget(null)} className="flex-1 p-3 bg-slate-100 font-bold rounded-xl text-sm">Cancel</button>
                <button onClick={() => { DB.updateUser(passwordTarget.id, { password: newPassword }); setPasswordTarget(null); refresh(); }} className="flex-1 p-3 bg-blue-600 text-white font-bold rounded-xl text-sm">Save</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;


import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole, TimeSlot } from '../../types';
import { useAuth } from '../../App';
import { 
  ShieldCheck, ShieldAlert, Key, Trash2, Search, Power, PowerOff, Lock, 
  History, Eye, X, Mail, Phone, Calendar, Info, Clock, Briefcase, GraduationCap
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  useEffect(() => { refresh(); }, []);
  const refresh = () => {
    setUsers(DB.getUsers());
    setSlots(DB.getSlots());
  };

  const filtered = users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleStatusToggle = (user: User) => {
    if (user.id === auth.user?.id) return alert("You cannot deactivate yourself.");
    const newState = !user.isBlocked;
    if (confirm(`Set ${user.fullName} to ${newState ? 'INACTIVE' : 'ACTIVE'}?`)) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Full System Audit</h1>
        <div className="text-[10px] font-black text-slate-400 bg-white border px-3 py-1 rounded-lg">
          TOTAL DATABASE RECORDS: {users.length}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border flex items-center gap-4 shadow-sm">
        <Search className="text-slate-400" />
        <input className="flex-1 outline-none text-sm font-medium" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
            <tr>
              <th className="text-left p-4">User Details</th>
              <th className="text-left p-4">System Role</th>
              <th className="text-left p-4">Session Access</th>
              <th className="text-right p-4">Audit Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(user => (
              <tr key={user.id} className={user.isBlocked ? 'opacity-50 grayscale bg-slate-50' : 'hover:bg-slate-50 transition'}>
                <td className="p-4">
                  <div className="font-bold text-slate-800">{user.fullName}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black">{user.email}</div>
                </td>
                <td className="p-4">
                  <select 
                    className="border-2 border-slate-100 rounded-xl px-3 py-1 text-xs font-bold outline-none focus:border-blue-500" 
                    value={user.role} 
                    onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                  >
                    <option value={UserRole.ADMIN}>ADMIN</option>
                    <option value={UserRole.STAFF}>STAFF</option>
                    <option value={UserRole.SUBSCRIBER}>SUBSCRIBER</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => handleStatusToggle(user)} className={`flex items-center gap-1 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${user.isBlocked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {user.isBlocked ? <PowerOff size={12} /> : <Power size={12} />}
                    {user.isBlocked ? 'Inactive' : 'Active'}
                  </button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setViewingUser(user)} className="p-2 text-slate-400 hover:text-blue-600 transition hover:bg-blue-50 rounded-xl" title="View Full History"><History size={18} /></button>
                  <button onClick={() => setPasswordTarget(user)} className="p-2 text-slate-400 hover:text-amber-600 transition hover:bg-amber-50 rounded-xl" title="Change Credentials"><Key size={18} /></button>
                  <button onClick={() => { if(confirm('Delete permanently?')) { DB.deleteUser(user.id); refresh(); } }} className="p-2 text-slate-400 hover:text-red-600 transition hover:bg-red-50 rounded-xl" title="Purge Record"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HISTORY MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <History className="text-blue-600" /> Registration Dossier
                </h3>
                <p className="text-xs text-slate-500">Historical records for {viewingUser.fullName}</p>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={24} className="text-slate-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Created</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar size={14}/> {new Date(viewingUser.registrationDate).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Access</p>
                  <p className={`text-sm font-black flex items-center gap-2 ${viewingUser.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                    {viewingUser.isBlocked ? <ShieldAlert size={14}/> : <ShieldCheck size={14}/>}
                    {viewingUser.isBlocked ? 'INACTIVE (RESTRICTED)' : 'ACTIVE (UNRESTRICTED)'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[1.5rem] border space-y-4">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b pb-2">
                   <Info size={14}/> Personal Profiles
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">WhatsApp</p>
                      <p className="text-sm font-bold text-emerald-600">{viewingUser.whatsapp}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Email</p>
                      <p className="text-sm font-bold text-slate-700">{viewingUser.email}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Gender Identity</p>
                      <p className="text-sm font-bold text-slate-700">{viewingUser.gender}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Staff Status</p>
                      <p className="text-sm font-bold text-slate-700">{viewingUser.status || 'N/A'}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-100 space-y-4">
                 <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 border-b border-blue-100 pb-2">
                   <Clock size={14}/> Training Commitment
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-blue-400 uppercase">Requested Workstation</p>
                      <p className="text-sm font-bold text-blue-700">{slots.find(s => s.id === viewingUser.preferredTimeSlotId)?.label || 'None Requested'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-blue-400 uppercase">Assigned Workstation</p>
                      <p className="text-sm font-bold text-slate-700">{slots.find(s => s.id === viewingUser.assignedTimeSlotId)?.label || 'Unassigned'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-blue-400 uppercase">Start Date</p>
                      <p className="text-sm font-bold text-slate-700">{viewingUser.startDate || 'Unspecified'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-blue-400 uppercase">End Date</p>
                      <p className="text-sm font-bold text-slate-700">{viewingUser.endDate || 'Unspecified'}</p>
                    </div>
                 </div>
              </div>

              {viewingUser.role === UserRole.STAFF && (
                <div className="bg-slate-800 p-6 rounded-[1.5rem] text-white space-y-4">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-700 pb-2">
                     <Briefcase size={14}/> Staff Dossier Extension
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Availability</p>
                        <p className="text-sm font-bold">{viewingUser.availableHours}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Education</p>
                        <p className="text-sm font-bold">{viewingUser.education}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Phone Specs</p>
                        <p className="text-sm font-bold">{viewingUser.phoneBrand} ({viewingUser.phoneSpecs})</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Previous Sites</p>
                        <p className="text-sm italic">{viewingUser.previousSites || 'None listed'}</p>
                      </div>
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-8 border-t bg-slate-50 flex justify-end gap-3">
               <button 
                  onClick={() => setViewingUser(null)}
                  className="bg-white border text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-100 transition"
                >
                  Close Dossier
                </button>
               {!viewingUser.isBlocked && viewingUser.id !== auth.user?.id && (
                  <button 
                    onClick={() => { handleStatusToggle(viewingUser); setViewingUser(null); }}
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-100 flex items-center gap-2"
                  >
                    <PowerOff size={18} /> Suspend User
                  </button>
               )}
               {viewingUser.isBlocked && (
                  <button 
                    onClick={() => { handleStatusToggle(viewingUser); setViewingUser(null); }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2"
                  >
                    <Power size={18} /> Activate User
                  </button>
               )}
            </div>
          </div>
        </div>
      )}

      {passwordTarget && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
             <h3 className="font-black text-xl mb-4 text-slate-800 uppercase tracking-tight flex items-center gap-2"><Lock size={20}/> Reset Access</h3>
             <input className="w-full border-2 border-slate-100 p-4 rounded-2xl mb-6 outline-none focus:border-blue-500 font-bold" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password..." />
             <div className="flex gap-2">
                <button onClick={() => setPasswordTarget(null)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                <button onClick={() => { DB.updateUser(passwordTarget.id, { password: newPassword }); setPasswordTarget(null); refresh(); }} className="flex-1 p-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100">Commit</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;

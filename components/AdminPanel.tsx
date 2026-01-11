
import React, { useState, useEffect, useMemo } from 'react';
import { DB } from '../store';
import { User, TimeSlot, UserRole, StaffStatus, PrivateNote, SlotShift } from '../types';
import { useAuth } from '../App';
import { 
  Users, Clock, Plus, Trash2, CheckCircle, XCircle, FileText, Smartphone, 
  UserCircle, Mail, Phone, MapPin, GraduationCap, Heart, Clock3, Globe, 
  Facebook, MessageSquareQuote, StickyNote, Info, AlertTriangle, Edit3, 
  Sun, Sunset, Moon, CloudSun, Search, Key, ShieldCheck, ShieldAlert, Ban,
  ArrowUpDown, ChevronUp, ChevronDown, Lock, Power, PowerOff, X, Briefcase
} from 'lucide-react';

type SortKey = 'id' | 'fullName' | 'email' | 'role' | 'isBlocked';
type SortOrder = 'asc' | 'desc';

const AdminPanel: React.FC = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'staff' | 'subscribers' | 'slots' | 'users'>('users');
  
  const [viewingStaff, setViewingStaff] = useState<User | null>(null);
  const [noteSubscriber, setNoteSubscriber] = useState<User | null>(null);
  const [newNote, setNewNote] = useState('');
  
  // Search and Sort State for Users Tab
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: 'fullName', order: 'asc' });
  
  // Custom Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string, role: string } | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Slot Management State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Partial<TimeSlot> | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const updatedUsers = DB.getUsers();
    const updatedSlots = DB.getSlots();
    setUsers(updatedUsers);
    setSlots(updatedSlots);
  };

  const handleApprove = (id: string) => {
    DB.updateUser(id, { status: StaffStatus.APPROVED, isBlocked: false });
    setViewingStaff(null);
    refreshData();
  };

  const handleReject = (id: string) => {
    DB.updateUser(id, { status: StaffStatus.REJECTED, isBlocked: true });
    setViewingStaff(null);
    refreshData();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.role === 'Slot') {
      DB.deleteSlot(deleteTarget.id);
    } else {
      DB.deleteUser(deleteTarget.id);
    }
    
    setDeleteTarget(null);
    refreshData();
  };

  const executeStatusToggle = () => {
    if (!statusTarget) return;
    if (statusTarget.id === auth.user?.id) {
      alert("Critical Error: Self-deactivation is prohibited by system security policy.");
      setStatusTarget(null);
      return;
    }

    const newBlockedState = !statusTarget.isBlocked;
    DB.updateUser(statusTarget.id, { isBlocked: newBlockedState });
    
    setStatusTarget(null);
    refreshData();
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (userId === auth.user?.id && newRole !== UserRole.ADMIN) {
      alert("Access Denied: You cannot demote your own administrator privileges.");
      return;
    }
    DB.updateUser(userId, { role: newRole });
    refreshData();
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTarget || !newPassword.trim()) return;
    
    DB.updateUser(passwordTarget.id, { password: newPassword });
    alert(`Security Update: Credentials for ${passwordTarget.fullName} have been modified.`);
    setPasswordTarget(null);
    setNewPassword('');
    refreshData();
  };

  const handleAddNote = () => {
    if (!noteSubscriber || !newNote.trim() || !auth.user) return;
    
    const note: PrivateNote = {
      id: `note-${Date.now()}`,
      authorId: auth.user.id,
      authorName: auth.user.displayName || auth.user.fullName,
      text: newNote,
      timestamp: Date.now()
    };

    const updatedNotes = [...(noteSubscriber.privateNotes || []), note];
    DB.updateUser(noteSubscriber.id, { privateNotes: updatedNotes });
    
    setNoteSubscriber({ ...noteSubscriber, privateNotes: updatedNotes });
    setNewNote('');
    refreshData();
  };

  const saveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot?.label || !editingSlot?.startTime || !editingSlot?.endTime || !editingSlot?.shift) return;

    if (editingSlot.id) {
      DB.updateSlot(editingSlot.id, editingSlot as TimeSlot);
    } else {
      DB.addSlot({ ...editingSlot, id: `slot-${Date.now()}` } as TimeSlot);
    }

    setIsSlotModalOpen(false);
    setEditingSlot(null);
    refreshData();
  };

  const toggleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedUsers = useMemo(() => {
    let result = users.filter(u => 
      u.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortConfig.order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return result;
  }, [users, userSearchTerm, sortConfig]);

  const pendingApplications = users.filter(u => u.role === UserRole.STAFF && u.status === StaffStatus.PENDING);
  const activeStaff = users.filter(u => u.role === UserRole.STAFF && u.status === StaffStatus.APPROVED);
  const subscribers = users.filter(u => u.role === UserRole.SUBSCRIBER);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border">
        <h1 className="text-xl font-bold text-slate-800">Admin Control Center</h1>
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="User Management" icon={<ShieldCheck size={16} />} />
          <TabButton active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} label={`Pending (${pendingApplications.length})`} icon={<FileText size={16} />} />
          <TabButton active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} label="Teachers" icon={<Users size={16} />} />
          <TabButton active={activeTab === 'subscribers'} onClick={() => setActiveTab('subscribers')} label="Students" icon={<UserCircle size={16} />} />
          <TabButton active={activeTab === 'slots'} onClick={() => setActiveTab('slots')} label="Time Slots" icon={<Clock size={16} />} />
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-300">
           <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-4 shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Search by name, email or ID..."
                  value={userSearchTerm}
                  onChange={e => setUserSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-3 rounded-xl">
                Total Records: {users.length}
              </div>
           </div>

           <div className="bg-white rounded-2xl border overflow-x-auto shadow-sm">
              <table className="w-full text-sm min-w-[900px]">
                 <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
                    <tr>
                       <th className="text-left p-4 cursor-pointer" onClick={() => toggleSort('id')}>
                          <div className="flex items-center gap-1">User ID <SortIcon active={sortConfig.key === 'id'} order={sortConfig.order} /></div>
                       </th>
                       <th className="text-left p-4 cursor-pointer" onClick={() => toggleSort('fullName')}>
                          <div className="flex items-center gap-1">Name <SortIcon active={sortConfig.key === 'fullName'} order={sortConfig.order} /></div>
                       </th>
                       <th className="text-left p-4 cursor-pointer" onClick={() => toggleSort('email')}>
                          <div className="flex items-center gap-1">Email <SortIcon active={sortConfig.key === 'email'} order={sortConfig.order} /></div>
                       </th>
                       <th className="text-left p-4 cursor-pointer" onClick={() => toggleSort('role')}>
                          <div className="flex items-center gap-1">Role <SortIcon active={sortConfig.key === 'role'} order={sortConfig.order} /></div>
                       </th>
                       <th className="text-left p-4 cursor-pointer" onClick={() => toggleSort('isBlocked')}>
                          <div className="flex items-center gap-1">Status <SortIcon active={sortConfig.key === 'isBlocked'} order={sortConfig.order} /></div>
                       </th>
                       <th className="text-right p-4">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y">
                    {processedUsers.map(user => (
                       <tr key={user.id} className={`transition-colors ${user.isBlocked ? 'bg-red-50/10' : 'hover:bg-slate-50'}`}>
                          <td className="p-4 font-mono text-[10px] text-slate-400">{user.id}</td>
                          <td className="p-4 font-bold text-slate-800">{user.fullName}</td>
                          <td className="p-4 text-slate-500">{user.email}</td>
                          <td className="p-4">
                             <select 
                                className="bg-white border rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                             >
                                <option value={UserRole.ADMIN}>ADMIN</option>
                                <option value={UserRole.STAFF}>STAFF</option>
                                <option value={UserRole.SUBSCRIBER}>SUBSCRIBER</option>
                             </select>
                          </td>
                          <td className="p-4">
                             <button 
                              onClick={() => setStatusTarget(user)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                user.isBlocked 
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                             }`}
                             >
                                {user.isBlocked ? <PowerOff size={12} /> : <Power size={12} />}
                                {user.isBlocked ? 'Inactive' : 'Active'}
                             </button>
                          </td>
                          <td className="p-4 text-right space-x-1">
                             <button 
                                onClick={() => setPasswordTarget(user)}
                                className="p-2 text-slate-400 hover:text-blue-600 transition hover:bg-blue-50 rounded-lg" 
                                title="Reset Password"
                             >
                                <Key size={16} />
                             </button>
                             <button 
                                onClick={() => setDeleteTarget({ id: user.id, name: user.fullName, role: 'User' })}
                                className="p-2 text-slate-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg" 
                                title="Delete User"
                             >
                                <Trash2 size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {processedUsers.length === 0 && <EmptyState message="No users matching your search." />}
           </div>
        </div>
      )}

      {/* Confirmation Modal for Status Toggle */}
      {statusTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border animate-in zoom-in duration-200">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${statusTarget.isBlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {statusTarget.isBlocked ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2 text-center uppercase tracking-tight">
                {statusTarget.isBlocked ? 'Re-activate Account?' : 'Deactivate Account?'}
              </h3>
              <p className="text-slate-500 text-sm text-center mb-8 leading-relaxed">
                {statusTarget.isBlocked 
                  ? `Restoring full exchange access for ${statusTarget.fullName}.` 
                  : `Deactivating ${statusTarget.fullName} will immediately terminate their current session and revoke all exchange access.`}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setStatusTarget(null)}
                  className="flex-1 bg-slate-100 text-slate-600 p-3 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeStatusToggle}
                  className={`flex-1 text-white p-3 rounded-xl font-bold transition shadow-lg ${statusTarget.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}
                >
                  Confirm Change
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {passwordTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
           <form onSubmit={handlePasswordReset} className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border flex flex-col items-center animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Set New Password</h3>
              <p className="text-slate-500 text-sm text-center mb-6 italic">Modifying access for: {passwordTarget.fullName}</p>
              
              <div className="w-full relative mb-6">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                 <input 
                  type="text" 
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 pl-12 text-center font-bold text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                 />
              </div>

              <div className="flex w-full gap-3">
                <button type="button" onClick={() => setPasswordTarget(null)} className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-100">Update Now</button>
              </div>
           </form>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {pendingApplications.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800">{app.fullName}</h3>
                  <p className="text-xs text-slate-500">{app.email}</p>
                </div>
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold">PENDING</span>
              </div>
              <div className="flex gap-2 border-t pt-4">
                <button onClick={() => setViewingStaff(app)} className="flex-1 bg-slate-100 text-slate-700 p-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition">Details</button>
                <button onClick={() => handleApprove(app.id)} className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition" title="Approve"><CheckCircle size={16} /></button>
                <button onClick={() => handleReject(app.id)} className="bg-amber-50 text-amber-600 px-3 py-2 rounded-lg hover:bg-amber-100 transition" title="Reject"><XCircle size={16} /></button>
              </div>
            </div>
          ))}
          {pendingApplications.length === 0 && <EmptyState message="No pending applications." />}
        </div>
      )}

      {activeTab === 'staff' && (
         <div className="bg-white rounded-2xl border overflow-hidden animate-in fade-in duration-300 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
                <tr>
                  <th className="text-left p-4">Teacher Name</th>
                  <th className="text-left p-4">WhatsApp</th>
                  <th className="text-left p-4">Assigned Slot</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeStaff.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{s.fullName}</div>
                      <div className="text-[10px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="p-4">{s.whatsapp}</td>
                    <td className="p-4">
                       <select 
                        className="bg-transparent border border-slate-200 rounded text-xs font-semibold focus:ring-0 p-1"
                        value={s.assignedTimeSlotId || ''}
                        onChange={(e) => {
                          DB.updateUser(s.id, { assignedTimeSlotId: e.target.value });
                          refreshData();
                        }}
                       >
                         <option value="">No Slot Assigned</option>
                         {slots.map(sl => <option key={sl.id} value={sl.id}>{sl.label}</option>)}
                       </select>
                    </td>
                    <td className="p-4 text-right">
                       <button onClick={() => setDeleteTarget({ id: s.id, name: s.fullName, role: 'Staff' })} className="p-2 text-red-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activeStaff.length === 0 && <EmptyState message="No verified teachers." />}
         </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-2xl border overflow-hidden animate-in fade-in duration-300 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
              <tr>
                <th className="text-left p-4">Student Name</th>
                <th className="text-left p-4">WhatsApp</th>
                <th className="text-left p-4">Current Slot</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{sub.fullName}</div>
                    <div className="text-[10px] text-slate-400">{sub.email}</div>
                  </td>
                  <td className="p-4">{sub.whatsapp}</td>
                  <td className="p-4">
                     <select 
                      className="bg-transparent border border-slate-200 rounded text-xs font-semibold focus:ring-0 p-1"
                      value={sub.assignedTimeSlotId || ''}
                      onChange={(e) => {
                        DB.updateUser(sub.id, { assignedTimeSlotId: e.target.value });
                        refreshData();
                      }}
                     >
                       <option value="">Pending Assignment</option>
                       {slots.map(sl => <option key={sl.id} value={sl.id}>{sl.label}</option>)}
                     </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                     <button onClick={() => setNoteSubscriber(sub)} className="p-2 text-blue-400 hover:text-blue-600 transition"><StickyNote size={16} /></button>
                     <button onClick={() => setDeleteTarget({ id: sub.id, name: sub.fullName, role: 'Subscriber' })} className="p-2 text-red-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 && <EmptyState message="No students found." />}
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Training Workstations</h2>
            <button 
              onClick={() => { setEditingSlot({ shift: SlotShift.MORNING }); setIsSlotModalOpen(true); }} 
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              <Plus size={18} /> Add Slot
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map(slot => (
              <div key={slot.id} className="bg-white p-6 rounded-3xl border flex flex-col shadow-sm hover:shadow-md transition">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className={`p-3 rounded-2xl ${
                          slot.shift === SlotShift.MORNING ? 'bg-amber-50 text-amber-600' :
                          slot.shift === SlotShift.AFTERNOON ? 'bg-blue-50 text-blue-600' :
                          slot.shift === SlotShift.EVENING ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-900 text-slate-100'
                       }`}>
                         {slot.shift === SlotShift.MORNING && <Sun size={20} />}
                         {slot.shift === SlotShift.AFTERNOON && <CloudSun size={20} />}
                         {slot.shift === SlotShift.EVENING && <Sunset size={20} />}
                         {slot.shift === SlotShift.NIGHT && <Moon size={20} />}
                       </div>
                       <div>
                          <p className="font-black text-slate-800 uppercase tracking-tight">{slot.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{slot.shift} Shift</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                       <Clock size={14} className="text-slate-400" />
                       {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                       <UserCircle size={14} className="text-slate-400" />
                       <span className="text-slate-500">Instructor:</span>
                       <span className="font-bold text-blue-600">
                         {users.find(u => u.id === slot.teacherId)?.fullName || 'Unassigned'}
                       </span>
                    </div>
                 </div>
                 <div className="flex gap-2 pt-4 border-t">
                    <button onClick={() => { setEditingSlot(slot); setIsSlotModalOpen(true); }} className="flex-1 bg-slate-100 text-slate-600 p-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition">Edit</button>
                    <button onClick={() => setDeleteTarget({ id: slot.id, name: slot.label, role: 'Slot' })} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"><Trash2 size={16} /></button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Application Dossier Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" /> Staff Application Dossier
                </h3>
                <p className="text-xs text-slate-500">Full verified recruitment record for {viewingStaff.fullName}</p>
              </div>
              <button onClick={() => setViewingStaff(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={24} className="text-slate-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Section title="Personal Profile" icon={<UserCircle size={16}/>}>
                    <Detail label="Full Name" value={viewingStaff.fullName} />
                    <Detail label="Gender" value={viewingStaff.gender} />
                    <Detail label="Religion" value={viewingStaff.religion} />
                    <Detail label="Status" value={viewingStaff.relationshipStatus} />
                    <Detail label="Birth Order" value={viewingStaff.birthOrder} />
                 </Section>

                 <Section title="Contact & Social" icon={<Globe size={16}/>}>
                    <Detail label="WhatsApp" value={viewingStaff.whatsapp} highlight />
                    <Detail label="Email" value={viewingStaff.email} />
                    <Detail label="Secondary Phone" value={viewingStaff.phoneNumber} />
                    <Detail label="Facebook" value={viewingStaff.fbLink} isLink />
                 </Section>

                 <Section title="Work & Education" icon={<GraduationCap size={16}/>}>
                    <Detail label="Education" value={viewingStaff.education} />
                    <Detail label="Division" value={viewingStaff.division} />
                    <Detail label="Student Status" value={viewingStaff.isRegularStudent ? 'Regular Student' : 'Not Regular'} />
                    <Detail label="Available Hours" value={viewingStaff.availableHours} highlight />
                 </Section>

                 <Section title="Technical Assets" icon={<Smartphone size={16}/>}>
                    <Detail label="Primary Device" value={viewingStaff.deviceSelection} />
                    <Detail label="Phone Brand" value={viewingStaff.phoneBrand} />
                    <Detail label="RAM / ROM" value={viewingStaff.phoneSpecs} />
                    <Detail label="Uses IMO?" value={viewingStaff.usesImo} />
                 </Section>

                 <div className="md:col-span-2 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <StickyNote size={14}/> Professional Background
                    </p>
                    <div className="bg-slate-50 p-4 rounded-2xl border text-sm text-slate-700 italic leading-relaxed">
                      {viewingStaff.previousSites || 'No previous site experience listed.'}
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="p-8 border-t bg-slate-50 flex justify-end gap-3">
               <button 
                  onClick={() => setViewingStaff(null)}
                  className="bg-white border text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-100 transition"
                >
                  Close
                </button>
               <button 
                  onClick={() => handleReject(viewingStaff.id)}
                  className="bg-amber-50 text-amber-600 px-6 py-3 rounded-2xl font-bold border border-amber-100 hover:bg-amber-100 transition"
                >
                  Reject Application
                </button>
               <button 
                  onClick={() => handleApprove(viewingStaff.id)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-700 transition"
                >
                  <CheckCircle size={18} /> Approve Instructor
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Private Notes Modal */}
      {noteSubscriber && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <MessageSquareQuote className="text-blue-600" size={20} /> Administrative Notes
                </h3>
                <p className="text-xs text-slate-500">Private observations for {noteSubscriber.fullName}</p>
              </div>
              <button onClick={() => setNoteSubscriber(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
               {noteSubscriber.privateNotes && noteSubscriber.privateNotes.length > 0 ? (
                 noteSubscriber.privateNotes.map(note => (
                   <div key={note.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-blue-600">{note.authorName}</span>
                        <span className="text-[10px] text-slate-400">{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{note.text}</p>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10">
                   <StickyNote className="mx-auto text-slate-200 mb-2" size={48} />
                   <p className="text-sm text-slate-400 italic">No notes found for this user.</p>
                 </div>
               )}
            </div>

            <div className="p-6 border-t bg-white space-y-3">
              <textarea 
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                rows={3} 
                placeholder="Write a private note..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
              <button 
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border flex flex-col items-center text-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Irreversible Action</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Confirm permanent deletion of <strong>{deleteTarget.name}</strong>. This data cannot be recovered from the exchange history.
            </p>
            <div className="flex w-full gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl font-bold">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-red-100">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal UI logic stays the same but properly integrated with handleSubmit */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
           <form onSubmit={saveSlot} className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in duration-200">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Configure Workstation</h3>
                <button type="button" onClick={() => setIsSlotModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><X size={24} className="text-slate-400" /></button>
              </div>
              <div className="p-8 space-y-4">
                <input required className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition" placeholder="Workstation Label" value={editingSlot?.label || ''} onChange={e => setEditingSlot({...editingSlot!, label: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="time" required className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition" value={editingSlot?.startTime || ''} onChange={e => setEditingSlot({...editingSlot!, startTime: e.target.value})} />
                  <input type="time" required className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition" value={editingSlot?.endTime || ''} onChange={e => setEditingSlot({...editingSlot!, endTime: e.target.value})} />
                </div>
                <select className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition" value={editingSlot?.shift || SlotShift.MORNING} onChange={e => setEditingSlot({...editingSlot!, shift: e.target.value as SlotShift})}>
                  {Object.values(SlotShift).map(s => <option key={s} value={s}>{s} Shift</option>)}
                </select>
                <select className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition" value={editingSlot?.teacherId || ''} onChange={e => setEditingSlot({...editingSlot!, teacherId: e.target.value})}>
                  <option value="">No Instructor Assigned</option>
                  {activeStaff.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                </select>
              </div>
              <div className="p-8 border-t bg-slate-50 flex gap-3">
                 <button type="button" onClick={() => setIsSlotModalOpen(false)} className="flex-1 bg-white border text-slate-600 p-4 rounded-2xl font-bold">Discard</button>
                 <button type="submit" className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-blue-100">Save Configuration</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

// Internal Helper Components
const Section: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b pb-2">
      {icon} {title}
    </h4>
    <div className="grid grid-cols-1 gap-3">
      {children}
    </div>
  </div>
);

const Detail: React.FC<{ label: string, value: any, highlight?: boolean, isLink?: boolean }> = ({ label, value, highlight, isLink }) => (
  <div className="space-y-0.5">
    <p className="text-[9px] font-bold text-slate-400 uppercase">{label}</p>
    {isLink && value ? (
      <a href={value} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline break-all">{value}</a>
    ) : (
      <p className={`text-sm font-bold ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value || 'N/A'}</p>
    )}
  </div>
);

const SortIcon: React.FC<{ active: boolean; order: SortOrder }> = ({ active, order }) => {
  if (!active) return <ArrowUpDown size={12} className="opacity-30" />;
  return order === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />;
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick} 
    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-white'}`}
  >
    {icon} {label}
  </button>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="py-12 text-center text-slate-400 italic bg-white rounded-2xl border border-dashed border-slate-200 mt-4">
    {message}
  </div>
);

export default AdminPanel;

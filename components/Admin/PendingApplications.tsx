
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole, StaffStatus, TimeSlot } from '../../types';
import { CheckCircle, XCircle, Clock, Calendar, Mail, Phone, UserCheck, ShieldAlert } from 'lucide-react';

const PendingApplications: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    // Filter users who are blocked (INACTIVE) and aren't existing staff pending verification
    const all = DB.getUsers();
    const pending = all.filter(u => u.isBlocked && u.role !== UserRole.ADMIN);
    setPendingUsers(pending);
    setSlots(DB.getSlots());
  };

  const handleApprove = (id: string) => {
    DB.updateUser(id, { isBlocked: false, status: StaffStatus.APPROVED });
    alert('Application Approved. User is now ACTIVE.');
    refresh();
  };

  const handleReject = (id: string) => {
    if (confirm('Permanently delete this application?')) {
      DB.deleteUser(id);
      refresh();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Incoming Applications</h1>
          <p className="text-sm text-slate-500">Review all pending accounts waiting for system activation.</p>
        </div>
        <div className="bg-white px-4 py-2 border rounded-xl shadow-sm text-sm font-bold text-slate-600">
          Pending: <span className="text-blue-600">{pendingUsers.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
              <tr>
                <th className="text-left p-4">Submission</th>
                <th className="text-left p-4">Applicant</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Time Slot</th>
                <th className="text-left p-4">Training Period</th>
                <th className="text-right p-4">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pendingUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-300" />
                      <span className="font-mono text-[10px] text-slate-500">
                        {new Date(user.registrationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{user.fullName}</div>
                    <div className="text-[10px] font-black uppercase text-slate-400">{user.role} · {user.gender}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-600"><Mail size={12} className="text-slate-300"/> {user.email}</div>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold"><Phone size={12} className="text-emerald-300"/> {user.whatsapp}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 font-bold text-[10px] inline-block">
                      {slots.find(s => s.id === user.preferredTimeSlotId)?.label || 'Unspecified'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <Calendar size={12} className="text-slate-300" /> START: {user.startDate || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <Calendar size={12} className="text-slate-300" /> END: {user.endDate || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprove(user.id)}
                        className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                        title="Activate Account"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleReject(user.id)}
                        className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-100 transition border border-red-100"
                        title="Reject & Delete"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingUsers.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <ShieldAlert className="mx-auto text-slate-200" size={48} />
               <p className="text-slate-400 font-medium italic">All caught up! No applications are currently pending review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApplications;

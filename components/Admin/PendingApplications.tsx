
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole, StaffStatus, TimeSlot } from '../../types';
import { CheckCircle, XCircle, Clock, Calendar, Mail, Phone, Info, X, Smartphone, Globe, GraduationCap } from 'lucide-react';

const PendingApplications: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => refresh(), []);

  const refresh = () => {
    const all = DB.getUsers();
    setPendingUsers(all.filter(u => u.isBlocked && u.role !== UserRole.ADMIN));
    setSlots(DB.getSlots());
  };

  const handleApprove = (id: string) => {
    DB.updateUser(id, { isBlocked: false, status: StaffStatus.APPROVED });
    refresh();
    setSelectedUser(null);
  };

  const handleReject = (id: string) => {
    if (confirm('Delete this application?')) {
      DB.deleteUser(id);
      refresh();
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase">Pending Applications</h1>
          <p className="text-sm text-slate-500">New system access requests awaiting verification.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
              <tr>
                <th className="text-left p-4">Submission</th>
                <th className="text-left p-4">Name/Role</th>
                <th className="text-left p-4">Contacts</th>
                <th className="text-left p-4">Training Dates</th>
                <th className="text-right p-4">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pendingUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-[10px] font-mono text-slate-400">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{user.fullName}</div>
                    <div className="text-[10px] uppercase font-black text-blue-500">{user.role}</div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-[11px]"><Mail size={12} className="text-slate-300"/> {user.email}</div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600"><Phone size={12} className="text-emerald-300"/> {user.whatsapp}</div>
                  </td>
                  <td className="p-4">
                     <div className="text-[10px] font-bold text-slate-500">START: {user.startDate || 'N/A'}</div>
                     <div className="text-[10px] font-bold text-slate-500">END: {user.endDate || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedUser(user)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition">
                       View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingUsers.length === 0 && <div className="p-20 text-center text-slate-400 italic">No pending applications.</div>}
        </div>
      </div>

      {/* Dossier Modal (The fix for "Details option not working") */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                 <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                       <Info className="text-blue-600" /> Full Registration History
                    </h3>
                    <p className="text-xs text-slate-500">Record ID: {selectedUser.id}</p>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section 1 */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 border-b pb-1"><Clock size={12}/> Personal Dossier</h4>
                       <DataPoint label="Name" value={selectedUser.fullName} />
                       <DataPoint label="Gender" value={selectedUser.gender} />
                       <DataPoint label="Religion" value={selectedUser.religion} />
                       <DataPoint label="Education" value={selectedUser.education} />
                       <DataPoint label="Status" value={selectedUser.relationshipStatus} />
                    </div>
                    {/* Section 2 */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 border-b pb-1"><Globe size={12}/> Contacts & Social</h4>
                       <DataPoint label="Primary WhatsApp" value={selectedUser.whatsapp} highlight />
                       <DataPoint label="Phone" value={selectedUser.phoneNumber} />
                       <DataPoint label="FB Link" value={selectedUser.fbLink} isLink />
                    </div>
                    {/* Section 3 */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 border-b pb-1"><Smartphone size={12}/> Technical Specs</h4>
                       <DataPoint label="Device" value={selectedUser.deviceSelection} />
                       <DataPoint label="Phone" value={`${selectedUser.phoneBrand} (${selectedUser.phoneSpecs})`} />
                       <DataPoint label="Daily Access" value={selectedUser.availableHours} highlight />
                    </div>
                    {/* Section 4 */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 border-b pb-1"><GraduationCap size={12}/> Training Period</h4>
                       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <DataPoint label="Start Date" value={selectedUser.startDate} />
                          <DataPoint label="End Date" value={selectedUser.endDate} />
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 p-6 rounded-2xl border">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">Previous Experience</h4>
                    <p className="text-sm italic text-slate-600">{selectedUser.previousSites || 'No previous experience listed.'}</p>
                 </div>
              </div>

              <div className="p-8 border-t bg-slate-50 flex gap-3">
                 <button onClick={() => setSelectedUser(null)} className="bg-white border text-slate-600 px-6 py-3 rounded-2xl font-bold">Close Dossier</button>
                 <button onClick={() => handleReject(selectedUser.id)} className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition">Reject Application</button>
                 <button onClick={() => handleApprove(selectedUser.id)} className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition">Approve & Activate</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const DataPoint = ({ label, value, highlight, isLink }: any) => (
  <div>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
    {isLink && value ? (
       <a href={value} target="_blank" className="text-xs font-bold text-blue-600 underline truncate block">{value}</a>
    ) : (
       <p className={`text-xs font-black ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value || 'N/A'}</p>
    )}
  </div>
);

export default PendingApplications;

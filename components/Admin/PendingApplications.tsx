
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole, StaffStatus, TimeSlot } from '../../types';
import { CheckCircle, XCircle, Clock, Calendar, Mail, Phone, Info, X, Smartphone, Globe, GraduationCap, ShieldCheck, StickyNote } from 'lucide-react';

const PendingApplications: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => refresh(), []);

  const refresh = () => {
    const all = DB.getUsers();
    // Filter for both Students and Staff that are currently blocked (Pending Approval)
    setPendingUsers(all.filter(u => u.isBlocked && u.role !== UserRole.ADMIN));
    setSlots(DB.getSlots());
  };

  const handleApprove = (id: string) => {
    DB.updateUser(id, { isBlocked: false, status: StaffStatus.APPROVED });
    refresh();
    setSelectedUser(null);
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this application?')) {
      DB.deleteUser(id);
      refresh();
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pending Applications</h1>
          <p className="text-slate-500 font-medium">Review and verify new account requests before activation.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border font-bold text-slate-600 shadow-sm">
          Pending: <span className="text-blue-600">{pendingUsers.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingUsers.map(user => (
          <div key={user.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-black text-slate-800 leading-tight">{user.fullName}</h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${user.role === UserRole.STAFF ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium">{user.email}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 border border-slate-100">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                 <Calendar size={14} className="text-slate-300" /> Submitted: {new Date(user.registrationDate).toLocaleDateString()}
               </div>
               {user.role === UserRole.SUBSCRIBER && (
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                   <Clock size={14} className="text-slate-300" /> Preferred Slot: {slots.find(s => s.id === user.preferredTimeSlotId)?.label || 'None'}
                 </div>
               )}
            </div>

            <div className="mt-auto space-y-3">
              <button 
                onClick={() => setSelectedUser(user)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2"
              >
                <Info size={16} /> View All Details
              </button>
              
              <hr className="border-slate-100 my-2" />
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleApprove(user.id)}
                  className="bg-[#10a352] hover:bg-[#0d8a45] text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(user.id)}
                  className="bg-[#fff1f1] hover:bg-[#ffe4e4] text-[#d93025] py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {pendingUsers.length === 0 && (
          <div className="col-span-full py-32 bg-white rounded-[3rem] border border-dashed flex flex-col items-center text-center">
            <CheckCircle className="text-slate-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-400">Application Queue Clear</h3>
            <p className="text-slate-300 text-sm">All new requests have been processed.</p>
          </div>
        )}
      </div>

      {/* Full Dossier Modal (The Detailed Information Option) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                 <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                       <ShieldCheck className="text-blue-600" /> Full Registration Dossier
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Status: {selectedUser.status || 'PENDING VERIFICATION'}</p>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400"/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1 */}
                    <div className="space-y-6">
                       <DossierSection title="Personal Profile" icon={<Info size={14}/>}>
                          <DataField label="Full Name" value={selectedUser.fullName} />
                          <DataField label="Gender" value={selectedUser.gender} />
                          <DataField label="Religion" value={selectedUser.religion} />
                          <DataField label="Relationship Status" value={selectedUser.relationshipStatus} />
                          <DataField label="Education Level" value={selectedUser.education} />
                       </DossierSection>

                       <DossierSection title="Training Request" icon={<Clock size={14}/>}>
                          <DataField label="Start Date" value={selectedUser.startDate} highlight />
                          <DataField label="End Date" value={selectedUser.endDate} highlight />
                          {selectedUser.preferredTimeSlotId && (
                            <DataField label="Requested Slot" value={slots.find(s => s.id === selectedUser.preferredTimeSlotId)?.label} highlight />
                          )}
                       </DossierSection>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                       <DossierSection title="Contact Channels" icon={<Globe size={14}/>}>
                          <DataField label="WhatsApp Primary" value={selectedUser.whatsapp} highlight color="text-emerald-600" />
                          <DataField label="Phone Secondary" value={selectedUser.phoneNumber} />
                          <DataField label="Email Address" value={selectedUser.email} />
                          <DataField label="Facebook Profile" value={selectedUser.fbLink} isLink />
                       </DossierSection>

                       {selectedUser.role === UserRole.STAFF && (
                         <DossierSection title="Technical Audit" icon={<Smartphone size={14}/>}>
                            <DataField label="Device Type" value={selectedUser.deviceSelection} />
                            <DataField label="Phone Brand" value={selectedUser.phoneBrand} />
                            <DataField label="Hardware Specs" value={selectedUser.phoneSpecs} />
                            <DataField label="Daily Availability" value={selectedUser.availableHours} highlight />
                         </DossierSection>
                       )}
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2"><StickyNote size={14}/> Background Experience</h4>
                    <p className="text-sm italic text-slate-600 leading-relaxed">
                      {selectedUser.previousSites || 'No previous site or training experience listed in application.'}
                    </p>
                 </div>
              </div>

              <div className="p-8 border-t bg-slate-50 flex gap-4">
                 <button onClick={() => setSelectedUser(null)} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition">Close Dossier</button>
                 <button onClick={() => handleReject(selectedUser.id)} className="px-8 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition">Reject Application</button>
                 <button onClick={() => handleApprove(selectedUser.id)} className="flex-1 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Approve & Activate Account
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Internal Helper Components for Dossier Modal
const DossierSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-2">
      {icon} {title}
    </h4>
    <div className="grid grid-cols-1 gap-4">
      {children}
    </div>
  </div>
);

const DataField = ({ label, value, highlight, color, isLink }: any) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{label}</p>
    {isLink && value ? (
       <a href={value} target="_blank" rel="noreferrer" className="text-xs font-black text-blue-600 underline truncate block">{value}</a>
    ) : (
       <p className={`text-xs font-black ${highlight ? (color || 'text-blue-600') : 'text-slate-800'}`}>{value || 'NOT PROVIDED'}</p>
    )}
  </div>
);

export default PendingApplications;

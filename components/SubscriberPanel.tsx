
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { DB } from '../store';
import { User, TimeSlot } from '../types';
import { Clock, User as UserIcon, Calendar, MessageCircle, Info } from 'lucide-react';

const SubscriberPanel: React.FC = () => {
  const { auth } = useAuth();
  const [assignedSlot, setAssignedSlot] = useState<TimeSlot | null>(null);
  const [teacher, setTeacher] = useState<User | null>(null);

  useEffect(() => {
    if (auth.user?.assignedTimeSlotId) {
      const slot = DB.getSlots().find(s => s.id === auth.user?.assignedTimeSlotId);
      if (slot) {
        setAssignedSlot(slot);
        if (slot.teacherId) {
          const t = DB.getUsers().find(u => u.id === slot.teacherId);
          if (t) setTeacher(t);
        }
      }
    }
  }, [auth.user]);

  if (!auth.user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500">Welcome, {auth.user.fullName}. Review your training schedule.</p>
        </div>
        <div className="hidden md:block px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-sm font-medium">
          Status: Active Subscriber
        </div>
      </header>

      {!auth.user.assignedTimeSlotId ? (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl flex items-start gap-4">
          <Info className="text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-amber-800">Pending Assignment</h3>
            <p className="text-amber-700 mb-4">You haven't been assigned a training time slot yet. Our administrator will assign you to your preferred slot soon.</p>
            <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm inline-block">
              <p className="text-xs text-amber-600 font-bold uppercase">Your Preferred Time</p>
              <p className="font-semibold text-amber-900">
                {DB.getSlots().find(s => s.id === auth.user?.preferredTimeSlotId)?.label || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Slot Card */}
          <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Clock size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">My Learning Slot</h2>
            <p className="text-3xl font-black text-blue-600 mb-2">{assignedSlot?.label}</p>
            <p className="text-slate-500 text-sm">Attendance is mandatory during this window. Please be on time.</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Calendar size={12} /> Weekly Recursion
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <UserIcon />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Assigned Teacher</h3>
                  <p className="text-slate-500 text-sm">{teacher ? 'Verified Instructor' : 'Assigning Instructor...'}</p>
                </div>
             </div>
             
             {teacher ? (
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Name</p>
                    <p className="font-bold text-slate-800">{teacher.fullName}</p>
                  </div>
                  <div className="flex gap-4">
                    <a 
                      href={`https://wa.me/${teacher.whatsapp.replace(/[^0-9]/g, '')}`} 
                      target="_blank"
                      className="flex-1 bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition font-bold text-sm shadow-md shadow-emerald-100"
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                    {teacher.fbLink && (
                      <a 
                        href={teacher.fbLink} 
                        target="_blank"
                        className="flex-1 bg-blue-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 transition font-bold text-sm shadow-md shadow-blue-100"
                      >
                        Social Link
                      </a>
                    )}
                  </div>
               </div>
             ) : (
               <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                 <p className="text-slate-400 text-sm italic">Teacher details will appear once assigned by admin.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Profile Details (Read-only) */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Registration Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="border-b pb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</span>
            <span className="font-semibold text-slate-800">{auth.user.fullName}</span>
          </div>
          <div className="border-b pb-2">
             <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Gender</span>
            <span className="font-semibold text-slate-800">{auth.user.gender}</span>
          </div>
          <div className="border-b pb-2">
             <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">WhatsApp</span>
            <span className="font-semibold text-slate-800">{auth.user.whatsapp}</span>
          </div>
          <div className="border-b pb-2">
             <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Preferred Time Slot</span>
            <span className="font-semibold text-slate-800">
               {DB.getSlots().find(s => s.id === auth.user?.preferredTimeSlotId)?.label || 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberPanel;

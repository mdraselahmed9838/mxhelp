
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { DB } from '../store';
import { User, TimeSlot, StaffStatus, PrivateNote } from '../types';
import { Calendar, Users, MessageSquare, ShieldAlert, CheckCircle2, Clock, StickyNote, XCircle, MessageSquareQuote } from 'lucide-react';

const StaffPanel: React.FC = () => {
  const { auth } = useAuth();
  const [mySlots, setMySlots] = useState<TimeSlot[]>([]);
  const [allSubscribers, setAllSubscribers] = useState<User[]>([]);
  
  const [noteSubscriber, setNoteSubscriber] = useState<User | null>(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    refreshData();
  }, [auth.user]);

  const refreshData = () => {
    if (auth.user) {
      const slots = DB.getSlots().filter(s => s.teacherId === auth.user?.id);
      setMySlots(slots);
      setAllSubscribers(DB.getUsers().filter(u => u.role === 'SUBSCRIBER'));
    }
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

  if (!auth.user) return null;

  const isPending = auth.user.status === StaffStatus.PENDING;
  const isRejected = auth.user.status === StaffStatus.REJECTED;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
           <ShieldAlert size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-4">Application Under Review</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          Thank you for applying to be a Staff member. Your profile is currently being verified by our main administrator. 
          <span className="block mt-4 font-bold text-amber-700">Access to tasks and time slots will be enabled once approved.</span>
        </p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
           <ShieldAlert size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-4">Application Rejected</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          Unfortunately, your application for the Admin Staff position did not meet our current requirements. 
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            Teacher Dashboard <CheckCircle2 className="text-green-500" />
          </h1>
          <p className="text-slate-500">Welcome, {auth.user.displayName || auth.user.fullName}. You have verified access.</p>
        </div>
        <div className="bg-white border p-3 px-5 rounded-2xl shadow-sm flex items-center gap-3">
           <Clock className="text-blue-500" size={20} />
           <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Working Commitment</p>
              <p className="text-sm font-bold text-slate-700">{auth.user.availableHours || 'Not Set'}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-1">
          <Calendar className="mb-4 opacity-70" />
          <h3 className="text-2xl font-bold">{mySlots.length}</h3>
          <p className="text-blue-100 text-sm">Assigned Slots</p>
        </div>
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-200 transition transform hover:-translate-y-1">
          <Users className="mb-4 opacity-70" />
          <h3 className="text-2xl font-bold">
            {allSubscribers.filter(s => mySlots.some(slot => slot.id === s.assignedTimeSlotId)).length}
          </h3>
          <p className="text-emerald-100 text-sm">Total Students</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Assigned Weekly Schedule</h2>
        {mySlots.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">You are approved, but no time slots have been assigned yet. Please contact Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {mySlots.map(slot => {
              const students = allSubscribers.filter(sub => sub.assignedTimeSlotId === slot.id);
              return (
                <div key={slot.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                    <span className="font-bold text-slate-700">{slot.label}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">OPEN WORKSTATION</span>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                       <Users size={14} /> My Students ({students.length})
                    </h4>
                    <div className="space-y-3">
                      {students.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-blue-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black">
                              {student.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{student.fullName}</p>
                              <p className="text-[10px] text-slate-400 font-medium">Verified Subscriber</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setNoteSubscriber(student)}
                              className="p-2 bg-slate-200 text-slate-600 rounded-lg transition hover:bg-slate-300 relative"
                              title="Private Notes"
                            >
                              <StickyNote size={18} />
                              {student.privateNotes?.length ? <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></span> : null}
                            </button>
                            <a 
                              href={`https://wa.me/${student.whatsapp.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg transition hover:bg-emerald-100"
                              title="WhatsApp Message"
                            >
                              <MessageSquare size={18} />
                            </a>
                          </div>
                        </div>
                      ))}
                      {students.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">No students currently assigned to this workstation.</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Private Notes Modal (Reuse the UI logic from AdminPanel) */}
      {noteSubscriber && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <MessageSquareQuote className="text-blue-600" size={20} /> Staff Notes
                </h3>
                <p className="text-xs text-slate-500">Private observations for {noteSubscriber.fullName}</p>
              </div>
              <button onClick={() => setNoteSubscriber(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><XCircle size={24} className="text-slate-400" /></button>
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
                   <p className="text-sm text-slate-400 italic">Add your first observation about this student.</p>
                 </div>
               )}
            </div>

            <div className="p-6 border-t bg-white space-y-3">
              <textarea 
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                rows={3} 
                placeholder="Write a private note (Admin/Staff only)..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
              <button 
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPanel;

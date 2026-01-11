
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { TimeSlot, SlotShift, User, UserRole, StaffStatus } from '../../types';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';

const TimeSlots: React.FC = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => refresh(), []);
  const refresh = () => { setSlots(DB.getSlots()); setTeachers(DB.getUsers().filter(u => u.role === UserRole.STAFF && u.status === StaffStatus.APPROVED)); };

  const addSlot = () => {
    const newSlot: TimeSlot = { id: `slot-${Date.now()}`, label: 'New Training', startTime: '09:00', endTime: '11:00', shift: SlotShift.MORNING };
    DB.addSlot(newSlot);
    refresh();
    setEditingId(newSlot.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black">Training Workstations</h1>
        <button onClick={addSlot} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm"><Plus size={18}/> New Slot</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map(slot => (
          <div key={slot.id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            {editingId === slot.id ? (
              <div className="space-y-2">
                <input className="w-full border p-2 rounded text-sm font-bold" value={slot.label} onChange={e => { DB.updateSlot(slot.id, { label: e.target.value }); refresh(); }} />
                <div className="flex gap-2">
                   <input type="time" className="flex-1 border p-2 rounded text-xs" value={slot.startTime} onChange={e => { DB.updateSlot(slot.id, { startTime: e.target.value }); refresh(); }} />
                   <input type="time" className="flex-1 border p-2 rounded text-xs" value={slot.endTime} onChange={e => { DB.updateSlot(slot.id, { endTime: e.target.value }); refresh(); }} />
                </div>
                <select className="w-full border p-2 rounded text-xs" value={slot.shift} onChange={e => { DB.updateSlot(slot.id, { shift: e.target.value as SlotShift }); refresh(); }}>
                   {Object.values(SlotShift).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="w-full border p-2 rounded text-xs font-bold text-blue-600" value={slot.teacherId || ''} onChange={e => { DB.updateSlot(slot.id, { teacherId: e.target.value }); refresh(); }}>
                   <option value="">No Instructor</option>
                   {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                </select>
                <button onClick={() => setEditingId(null)} className="w-full bg-slate-800 text-white p-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2"><Save size={14}/> Save</button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{slot.label}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">{slot.shift}</p>
                  </div>
                  <div className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">{slot.startTime} - {slot.endTime}</div>
                </div>
                <div className="text-xs text-blue-600 font-bold">
                   Teacher: {teachers.find(t => t.id === slot.teacherId)?.fullName || 'Unassigned'}
                </div>
                <div className="flex gap-2 border-t pt-4">
                  <button onClick={() => setEditingId(slot.id)} className="flex-1 p-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1"><Edit3 size={12}/> Edit</button>
                  <button onClick={() => { DB.deleteSlot(slot.id); refresh(); }} className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100"><Trash2 size={16}/></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default TimeSlots;

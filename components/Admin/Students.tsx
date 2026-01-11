
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, TimeSlot, UserRole } from '../../types';
import { Trash2 } from 'lucide-react';

const Students: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  useEffect(() => refresh(), []);
  const refresh = () => { setStudents(DB.getUsers().filter(u => u.role === UserRole.SUBSCRIBER)); setSlots(DB.getSlots()); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Student Enrollment</h1>
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black border-b">
            <tr><th className="text-left p-4">Name</th><th className="text-left p-4">Slot</th><th className="text-right p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold">{s.fullName}</td>
                <td className="p-4">
                  <select className="border rounded p-1 text-xs" value={s.assignedTimeSlotId || ''} onChange={e => { DB.updateUser(s.id, { assignedTimeSlotId: e.target.value }); refresh(); }}>
                    <option value="">No Assignment</option>
                    {slots.map(sl => <option key={sl.id} value={sl.id}>{sl.label}</option>)}
                  </select>
                </td>
                <td className="p-4 text-right"><button onClick={() => { DB.deleteUser(s.id); refresh(); }} className="text-red-400"><Trash2 size={18}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Students;

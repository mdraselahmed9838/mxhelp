
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { TimeSlot, SlotShift, User, UserRole, StaffStatus } from '../../types';
import { Plus, Trash2, Edit3, Save, X, CheckCircle, AlertCircle, Clock, UserCheck, Eye, EyeOff } from 'lucide-react';

const TimeSlots: React.FC = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Partial<TimeSlot> | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setSlots(DB.getSlots());
    setTeachers(DB.getUsers().filter(u => u.role === UserRole.STAFF && u.status === StaffStatus.APPROVED));
  };

  const handleOpenAdd = () => {
    setEditingSlot({
      label: '',
      startTime: '09:00',
      endTime: '11:00',
      shift: SlotShift.MORNING,
      isActive: true,
      teacherId: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: TimeSlot) => {
    setEditingSlot({ ...slot });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (slot: TimeSlot) => {
    DB.updateSlot(slot.id, { isActive: !slot.isActive });
    showMessage(`${slot.label} is now ${!slot.isActive ? 'Active' : 'Inactive'}`, 'success');
    refresh();
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot?.label || !editingSlot?.startTime || !editingSlot?.endTime) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    if (editingSlot.startTime >= editingSlot.endTime) {
      showMessage('End time must be after start time', 'error');
      return;
    }

    try {
      if (editingSlot.id) {
        // UPDATE Existing
        DB.updateSlot(editingSlot.id, editingSlot as TimeSlot);
        showMessage('Time slot updated successfully', 'success');
      } else {
        // ADD New
        const newId = `slot-${Date.now()}`;
        DB.addSlot({ ...editingSlot, id: newId } as TimeSlot);
        showMessage('New time slot created successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingSlot(null);
      refresh();
    } catch (err) {
      showMessage('Failed to save changes', 'error');
    }
  };

  const handleDelete = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete "${label}"? This action cannot be undone.`)) {
      DB.deleteSlot(id);
      showMessage('Time slot deleted', 'success');
      refresh();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Training Workstations</h1>
          <p className="text-sm text-slate-500">Configure and manage class schedules and instructor assignments.</p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-0.5"
        >
          <Plus size={18} /> New Workstation
        </button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-xl border text-sm font-bold animate-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map(slot => (
          <div 
            key={slot.id} 
            className={`bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md relative overflow-hidden ${!slot.isActive ? 'opacity-70 grayscale-[0.5]' : ''}`}
          >
            <div className={`absolute top-0 right-0 p-1.5 px-3 rounded-bl-xl text-[10px] font-black uppercase tracking-tighter ${slot.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
              {slot.isActive ? 'Active' : 'Inactive'}
            </div>
            
            <div className="flex items-center gap-3 mb-4 pt-2">
              <div className={`p-3 rounded-2xl ${slot.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-tight">{slot.label}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase">{slot.shift} Shift</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Time Window</span>
                <span className="font-bold text-slate-700">{slot.startTime} — {slot.endTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Instructor</span>
                <span className="font-bold text-blue-600">
                  {teachers.find(t => t.id === slot.teacherId)?.fullName || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenEdit(slot)} 
                className="flex-1 bg-white border border-slate-200 text-slate-600 p-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <Edit3 size={14} /> Edit
              </button>
              <button 
                onClick={() => handleToggleStatus(slot)} 
                className={`p-2.5 rounded-xl border transition flex items-center justify-center ${slot.isActive ? 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'}`}
                title={slot.isActive ? "Deactivate Slot" : "Activate Slot"}
              >
                {slot.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button 
                onClick={() => handleDelete(slot.id, slot.label)} 
                className="p-2.5 bg-red-50 border border-red-100 text-red-500 rounded-xl hover:bg-red-100 transition"
                title="Delete Permanently"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {slots.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <Clock className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium">No workstations configured yet.</p>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in duration-200"
          >
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  {editingSlot?.id ? 'Modify Workstation' : 'New Workstation'}
                </h3>
                <p className="text-xs text-slate-500">Configure class timing and instructor roles.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              {/* HIDDEN ID FIELD SIMULATION via editingSlot.id check */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Workstation Name *</label>
                <input 
                  required
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition"
                  placeholder="e.g. Advanced AI Training A"
                  value={editingSlot?.label || ''}
                  onChange={e => setEditingSlot({ ...editingSlot!, label: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Start Time *</label>
                  <input 
                    type="time"
                    required
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition"
                    value={editingSlot?.startTime || '09:00'}
                    onChange={e => setEditingSlot({ ...editingSlot!, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">End Time *</label>
                  <input 
                    type="time"
                    required
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition"
                    value={editingSlot?.endTime || '11:00'}
                    onChange={e => setEditingSlot({ ...editingSlot!, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Shift</label>
                  <select 
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition appearance-none"
                    value={editingSlot?.shift || SlotShift.MORNING}
                    onChange={e => setEditingSlot({ ...editingSlot!, shift: e.target.value as SlotShift })}
                  >
                    {Object.values(SlotShift).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Assign Instructor</label>
                  <select 
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none transition appearance-none text-blue-600"
                    value={editingSlot?.teacherId || ''}
                    onChange={e => setEditingSlot({ ...editingSlot!, teacherId: e.target.value })}
                  >
                    <option value="">Vacant / No Assignment</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-dashed">
                <input 
                  type="checkbox" 
                  id="isActive"
                  className="w-5 h-5 accent-blue-600"
                  checked={editingSlot?.isActive ?? true}
                  onChange={e => setEditingSlot({ ...editingSlot!, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">Set workstation to Active Status (Available for assignments)</label>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 bg-white border border-slate-200 text-slate-600 p-4 rounded-2xl font-bold hover:bg-white transition"
              >
                Discard
              </button>
              <button 
                type="submit" 
                className="flex-2 bg-blue-600 text-white p-4 px-8 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Save size={18} /> {editingSlot?.id ? 'Commit Changes' : 'Initialize Workstation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DB } from '../store';
import { UserRole, Gender, StaffStatus } from '../types';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const StaffRegister: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<any>({
    fullName: '',
    email: '',
    password: '',
    gender: Gender.FEMALE,
    whatsapp: '',
    religion: 'ISLAM',
    division: 'Dhaka',
    education: 'HSC / Diploma',
    phoneNumber: '',
    relationshipStatus: 'Single',
    deviceSelection: 'PHONE',
    birthOrder: '1',
    isRegularStudent: false,
    usesImo: 'Yes',
    phoneBrand: 'Samsung',
    phoneSpecs: '4/64',
    previousSites: '',
    availableHours: '8 Hours',
    fbLink: '',
    startDate: '',
    endDate: '',
    role: UserRole.STAFF,
    status: StaffStatus.PENDING,
    isBlocked: true // Staff must be approved
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert("You must agree to the conditions first.");
    
    const success = DB.addUser({
      ...formData,
      id: `staff-${Date.now()}`,
      agreement: true,
      registrationDate: new Date().toISOString()
    });

    if (success) {
      alert('Staff Application submitted! Please wait for Admin approval.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border">
        {/* Notice Section */}
        <div className="bg-red-50 p-8 border-b border-red-100">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <ShieldCheck size={24} />
            <h1 className="text-xl font-black uppercase tracking-widest">Admin Recruitment Notice</h1>
          </div>
          <div className="bg-white p-6 rounded-xl border border-red-200 text-slate-700 space-y-4 text-sm leading-relaxed">
            <p className="font-bold text-red-700 text-lg">এডমিন নিয়োগ বিজ্ঞপ্তি (শুধুমাত্র মেয়েদের জন্য)</p>
            <p>আপনার সকল তথ্য সঠিক হতে হবে। ভুল তথ্য দিলে বহিষ্কার করা হবে। প্রতিদিন ৮-১২ ঘন্টা সময় দিতে হবে। মেইন এডমিনের অনুমতি ছাড়া অন্য কোথাও কাজ করা যাবে না।</p>
          </div>
          <label className="mt-6 flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-dashed border-red-200 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-red-600"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="font-bold text-red-700">আমি উপরোক্ত সকল শর্তাবলীর সাথে একমত</span>
          </label>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className={`p-8 space-y-8 ${!agreed ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2"><CheckCircle2 className="text-blue-500" size={18} /> Account Info</h3>
              <InputField label="Full Name" value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} required />
              <InputField label="Email (Login)" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} required />
              <InputField label="Password" type="password" value={formData.password} onChange={v => setFormData({...formData, password: v})} required />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2"><CheckCircle2 className="text-blue-500" size={18} /> Contact Info</h3>
              <InputField label="WhatsApp Number" value={formData.whatsapp} onChange={v => setFormData({...formData, whatsapp: v})} required />
              <InputField label="Second Phone" value={formData.phoneNumber} onChange={v => setFormData({...formData, phoneNumber: v})} />
              <InputField label="FB Link" value={formData.fbLink} onChange={v => setFormData({...formData, fbLink: v})} placeholder="https://..." />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2"><CheckCircle2 className="text-blue-500" size={18} /> Background</h3>
              <SelectField label="Religion" value={formData.religion} options={['ISLAM', 'HINDU', 'OTHER']} onChange={v => setFormData({...formData, religion: v})} />
              <SelectField label="Division" value={formData.division} options={['Dhaka', 'Rajshahi', 'Chattogram', 'Sylhet', 'Khulna']} onChange={v => setFormData({...formData, division: v})} />
              <SelectField label="Education" value={formData.education} options={['SSC', 'HSC', 'Degree', 'Honours']} onChange={v => setFormData({...formData, education: v})} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2"><CheckCircle2 className="text-blue-500" size={18} /> Technical Specs</h3>
              <SelectField label="Primary Device" value={formData.deviceSelection} options={['PHONE', 'COMPUTER', 'BOTH']} onChange={v => setFormData({...formData, deviceSelection: v})} />
              <InputField label="Phone Brand" value={formData.phoneBrand} onChange={v => setFormData({...formData, phoneBrand: v})} />
              <SelectField label="Daily Availability" value={formData.availableHours} options={['8 Hours', '12 Hours', '14 Hours']} onChange={v => setFormData({...formData, availableHours: v})} />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
               <div>
                  <label className="text-[10px] font-black uppercase text-blue-500">Requested Start Date</label>
                  <input type="date" className="w-full bg-white border p-2 rounded-lg" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-blue-500">Requested End Date</label>
                  <input type="date" className="w-full bg-white border p-2 rounded-lg" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
               </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Previous Site Experience</label>
              <textarea rows={3} className="w-full border rounded-lg p-3 bg-slate-50" value={formData.previousSites} onChange={e => setFormData({...formData, previousSites: e.target.value})} placeholder="Links and roles..."></textarea>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition">
            SUBMIT STAFF APPLICATION
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = 'text', required = false, placeholder = '' }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label} {required && '*'}</label>
    <input type={type} required={required} placeholder={placeholder} className="w-full border rounded-lg p-3 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const SelectField = ({ label, value, options, onChange }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
    <select className="w-full border rounded-lg p-3 bg-slate-50 text-sm font-medium" value={value} onChange={e => onChange(e.target.value)}>
      {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default StaffRegister;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DB } from '../store';
import { UserRole, Gender, StaffStatus } from '../types';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    role: UserRole.STAFF,
    status: StaffStatus.PENDING,
    // Fixed: Added isBlocked: false to satisfy User interface requirement
    isBlocked: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the conditions first.");
      return;
    }
    
    // Fixed: spread includes isBlocked from formData
    DB.addUser({
      ...formData,
      id: `staff-${Date.now()}`,
      agreement: agreed
    });
    alert('Application submitted! Please wait for admin approval.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header Notice Section */}
          <div className="bg-red-50 p-8 border-b border-red-100">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <ShieldCheck size={24} />
              <h1 className="text-xl font-black uppercase tracking-widest">ADMIN RECRUITMENT NOTICE (Only For Girls)</h1>
            </div>
            <div className="bg-white p-6 rounded-xl border border-red-200 text-slate-700 space-y-4 text-sm leading-relaxed whitespace-pre-line">
              <p className="font-bold text-red-700 text-lg mb-2">এডমিন নিয়োগ বিজ্ঞপ্তি</p>
              <p>Ony For Girls</p>
              <p>বর্তমানে আমরা শুধু রাত রাত 12 টা থেকে সকাল 6 টা পর্যন্ত দেখতে পারবে এমন এডমিন খুজতেছি। অনুগ্রহপূর্বক আপনি যদি রাতে না দেখতে পারেন সে ক্ষেত্রে আবেদন করা থেকে বিরত থাকবেন।</p>
              <p>আপনি এখানে যে তথ্যগুলো প্রদান করবেন সেগুলো 100% সঠিক হতে হবে পরবর্তীতে ভুল প্রমাণিত হলে আমরা আপনাকে এডমিন থেকে বহিষ্কার করব। আমরা কথা দিচ্ছি আপনার কোন তথ্য অন্য কাউকে শেয়ার করবো না আমরা শুধুমাত্র আপনাকে যাচাইয়ের জন্য এই তথ্যগুলো নিয়ে থাকি।</p>
              <p>ঠিকমত টাইম মেন্টেন করতে করে কাজ করতে না পারলে আবেদন করা থেকে বিরত থাকুন। প্রতিদিন কমপক্ষে ৮ থেকে ১২ ঘন্টা সময় দিতে হবে। (নামাজ এবং খাওয়ার জন্য সময় দেওয়া হবে।)</p>
              <p>ধৈর্যশীল হতে হবে এবং দীর্ঘদিন কাজ করার মানসিকতা থাকতে হবে। সময়ের বাহিরে জরুরি কোন মিটিং এর আয়োজন করলে উপস্থিত থাকতে হবে। দীর্ঘ সময়ের জন্য কোথাও যাওয়ার প্রয়োজন হলে অথবা ছুটির প্রয়োজন হলে ২৪ ঘন্টা আগে মেইন এডমিন কে জানাতে হব। এডমিনের অনুমতি ব্যতীত অন্য কোন সাইড অথবা অন্য কোন কাজ কোন মেম্বারকে দেওয়া যাবে না। অথবা অন্য কোন কোম্পানিতে ইনভাইট করা যাবে না।</p>
            </div>
            
            <label className="mt-6 flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-dashed border-red-200 cursor-pointer hover:bg-red-50 transition">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-red-600"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="font-bold text-red-700">I agree with the above conditions</span>
            </label>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className={`p-8 space-y-8 transition-opacity ${!agreed ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={18} /> Personal Details
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input required className="w-full border rounded-lg p-3 bg-slate-50" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Login)</label>
                  <input required type="email" className="w-full border rounded-lg p-3 bg-slate-50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                  <input required type="password" className="w-full border rounded-lg p-3 bg-slate-50" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.MALE}>Male (Warning: Girls Only)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Religion</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.religion} onChange={e => setFormData({...formData, religion: e.target.value})}>
                    <option value="ISLAM">Islam</option>
                    <option value="HINDU">Hindu</option>
                  </select>
                </div>
              </div>

              {/* Work & Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={18} /> Location & Work
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Division</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})}>
                    {['Rajshahi', 'Dhaka', 'Chattogram', 'Khulna', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Education</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}>
                    {['JSC', 'SSC', 'HSC / Diploma', 'Honours / Degree', 'Study Completed but Unemployed'].map(ed => <option key={ed} value={ed}>{ed}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Relationship Status</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.relationshipStatus} onChange={e => setFormData({...formData, relationshipStatus: e.target.value})}>
                    {['Single', 'In Relationship', 'Married'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facebook Profile Link</label>
                  <input className="w-full border rounded-lg p-3 bg-slate-50" placeholder="https://facebook.com/username" value={formData.fbLink} onChange={e => setFormData({...formData, fbLink: e.target.value})} />
                </div>
              </div>

              {/* Contact & Technical */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={18} /> Contact & Device
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp Number</label>
                  <input required className="w-full border rounded-lg p-3 bg-slate-50" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input required className="w-full border rounded-lg p-3 bg-slate-50" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Device</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.deviceSelection} onChange={e => setFormData({...formData, deviceSelection: e.target.value})}>
                    <option value="PHONE">Phone</option>
                    <option value="COMPUTER">Computer</option>
                    <option value="BOTH">Phone / Computer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Brand</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.phoneBrand} onChange={e => setFormData({...formData, phoneBrand: e.target.value})}>
                    {['Samsung', 'Realme', 'Vivo', 'Symphony', 'OnePlus', 'Other'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">RAM / ROM</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.phoneSpecs} onChange={e => setFormData({...formData, phoneSpecs: e.target.value})}>
                    {['6/128', '4/64', '3/32', '2/16', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-blue-500" size={18} /> Habits & Availability
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Birth Order in Family</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.birthOrder} onChange={e => setFormData({...formData, birthOrder: e.target.value})}>
                    {['1', '2', '3', 'Only Child', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isRegularStudent} onChange={e => setFormData({...formData, isRegularStudent: e.target.checked})} />
                    <span className="text-sm font-medium">Regular Student?</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Do you use IMO?</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.usesImo} onChange={e => setFormData({...formData, usesImo: e.target.value})}>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Installed but not regular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Daily Available Hours</label>
                  <select className="w-full border rounded-lg p-3 bg-slate-50" value={formData.availableHours} onChange={e => setFormData({...formData, availableHours: e.target.value})}>
                    <option>8 Hours</option>
                    <option>12 Hours</option>
                    <option>14 Hours</option>
                  </select>
                </div>
              </div>

              {/* Textarea span across */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Previous Working Sites (Links & Descriptions)</label>
                <textarea rows={3} className="w-full border rounded-lg p-3 bg-slate-50" value={formData.previousSites} onChange={e => setFormData({...formData, previousSites: e.target.value})} placeholder="Site 1: URL - description..."></textarea>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-8">
              <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-1">
                SUBMIT APPLICATION
              </button>
              <Link to="/login" className="text-slate-500 hover:text-blue-600 font-bold transition">Cancel & Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffRegister;

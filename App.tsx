
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { DB } from '../store';
import { UserRole, Gender } from '../types';
import { LogIn, Mail, Lock, UserCircle, Briefcase, Phone, Calendar } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
            <LogIn size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">TrainSupport Pro</h1>
          <p className="text-slate-500">Sign in to your dashboard</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">
            Sign In Now
          </button>
        </form>

        <div className="mt-8 pt-8 border-t text-center space-y-4">
          <p className="text-slate-500 text-sm">Need a Student account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link></p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <h3 className="font-black text-xs uppercase text-slate-400 mb-2 flex items-center justify-center gap-2">
               <Briefcase size={14} /> Careers
             </h3>
             <Link to="/staff-register" className="block w-full bg-slate-800 text-white p-2 rounded-xl text-xs font-bold hover:bg-black transition">
               APPLY AS STAFF
             </Link>
          </div>
          {(import.meta as any).env?.DEV && (
            <div className="mt-4 p-2 bg-amber-50 rounded-lg text-[10px] text-amber-700 font-mono">
              DEV MODE: admin@tss.com / admin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: Gender.MALE,
    whatsapp: '',
    preferredTimeSlotId: '',
    startDate: '',
    endDate: '',
    role: UserRole.SUBSCRIBER,
    isBlocked: true // NEW: Default to blocked (pending approval)
  });

  const slots = DB.getSlots();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    DB.addUser({
      ...formData,
      id: `sub-${Date.now()}`,
      registrationDate: new Date().toISOString()
    });
    alert('Registration submitted! Please wait for admin approval before logging in.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 py-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Student Signup</h1>
          <p className="text-slate-500">Submit your application for the training period.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:outline-none"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:outline-none"
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Slot</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                value={formData.preferredTimeSlotId}
                onChange={e => setFormData({...formData, preferredTimeSlotId: e.target.value})}
                required
              >
                <option value="">Select a Slot</option>
                {slots.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* NEW: TRAINING PERIOD DATES */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div>
              <label className="block text-xs font-black uppercase text-blue-600 mb-2">Requested Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                <input 
                  type="date"
                  required
                  className="w-full bg-white border border-blue-200 rounded-xl p-3 pl-11 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-blue-600 mb-2">Requested End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                <input 
                  type="date"
                  required
                  className="w-full bg-white border border-blue-200 rounded-xl p-3 pl-11 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-6">
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform active:scale-95">
              Submit Application
            </button>
            <p className="text-center text-slate-500 text-sm mt-6">
              Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

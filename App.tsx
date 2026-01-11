
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, AuthState } from './types';
import { DB } from './store';
import { Login, Register } from './components/Auth';
import StaffRegister from './components/StaffRegister';
import Dashboard from './components/Dashboard';
import { Layout } from './components/Layout';

// Modular Admin Pages
import Pending from './components/Admin/Pending';
import Teachers from './components/Admin/Teachers';
import Students from './components/Admin/Students';
import TimeSlots from './components/Admin/TimeSlots';
import UserManagement from './components/Admin/UserManagement';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  checkSuspension: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('tss_session_active');
    return saved ? { user: JSON.parse(saved), isAuthenticated: true } : { user: null, isAuthenticated: false };
  });

  const login = (email: string, pass: string) => {
    const users = DB.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    
    if (user) {
      if (user.isBlocked) {
        return { success: false, error: 'Account Suspended. Please contact support.' };
      }
      setAuth({ user, isAuthenticated: true });
      localStorage.setItem('tss_session_active', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('tss_session_active');
  };

  const checkSuspension = () => {
    if (auth.user) {
      const users = DB.getUsers();
      const current = users.find(u => u.id === auth.user?.id);
      // Force logout if blocked while in session
      if (!current || current.isBlocked) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, checkSuspension }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!auth.isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!auth.isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/staff-register" element={<StaffRegister />} />
          
          <Route element={auth.isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/timeslots" element={<TimeSlots />} />
            <Route path="/users" element={<UserManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;

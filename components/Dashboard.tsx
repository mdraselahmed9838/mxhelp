
import React from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';
import AdminPanel from './AdminPanel';
import StaffPanel from './StaffPanel';
import SubscriberPanel from './SubscriberPanel';

const Dashboard: React.FC = () => {
  const { auth } = useAuth();

  if (!auth.user) return null;

  switch (auth.user.role) {
    case UserRole.ADMIN:
      return <AdminPanel />;
    case UserRole.STAFF:
      return <StaffPanel />;
    case UserRole.SUBSCRIBER:
      return <SubscriberPanel />;
    default:
      return <div>Access Denied</div>;
  }
};

export default Dashboard;

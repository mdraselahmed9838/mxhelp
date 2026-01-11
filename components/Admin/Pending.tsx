
import React, { useState, useEffect } from 'react';
import { DB } from '../../store';
import { User, UserRole, StaffStatus } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

const Pending: React.FC = () => {
  const [apps, setApps] = useState<User[]>([]);
  useEffect(() => refresh(), []);
  const refresh = () => setApps(DB.getUsers().filter(u => u.role === UserRole.STAFF && u.status === StaffStatus.PENDING));
  
  const handleAction = (id: string, status: StaffStatus) => {
    DB.updateUser(id, { status });
    refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Pending Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <div key={app.id} className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold">{app.fullName}</h3>
            <p className="text-xs text-slate-500 mb-4">{app.email}</p>
            <div className="flex gap-2 pt-4 border-t">
              <button onClick={() => handleAction(app.id, StaffStatus.APPROVED)} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold">Approve</button>
              <button onClick={() => handleAction(app.id, StaffStatus.REJECTED)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold">Reject</button>
            </div>
          </div>
        ))}
        {apps.length === 0 && <div className="text-slate-400 italic py-10">No pending staff applications.</div>}
      </div>
    </div>
  );
};
export default Pending;

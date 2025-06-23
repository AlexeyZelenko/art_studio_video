import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminRoute: React.FC = () => {
  const { user, loading, isAuthorized } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  if (!user || !isAuthorized || !isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard />;
};

export default AdminRoute;
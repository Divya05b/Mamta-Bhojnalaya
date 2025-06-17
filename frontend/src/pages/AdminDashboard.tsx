import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/admin/DashboardLayout';
import DashboardOverview from '../components/admin/DashboardOverview';
import MenuManagement from '../components/admin/MenuManagement';
import OrderManagement from '../components/admin/OrderManagement';
import ReviewManagement from '../components/admin/ReviewManagement';
import Analytics from '../components/admin/Analytics';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  recentOrders: Array<{
    id: number;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  salesData: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/admin') {
      fetchDashboardStats();
    }
  }, [location.pathname]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      const data = await response.json();
      console.log(data);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuUpdate = () => {
    // Refresh dashboard stats when menu is updated
    if (location.pathname === '/admin') {
      fetchDashboardStats();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    switch (location.pathname) {
      case '/admin':
        return stats && <DashboardOverview stats={stats} loading={loading} />;
      case '/admin/menu':
        return <MenuManagement onMenuUpdate={handleMenuUpdate} />;
      case '/admin/orders':
        return <OrderManagement />;
      case '/admin/analytics':
        return <Analytics />;
      case '/admin/reviews':
        return <ReviewManagement />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard; 
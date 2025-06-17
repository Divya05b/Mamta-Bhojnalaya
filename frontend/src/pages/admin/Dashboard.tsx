import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/api';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import PageBackground from '../../components/PageBackground';

interface OrderStatusSummary {
  status: string;
  count: number;
  totalRevenue: number;
}

interface TopMenuItem {
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalMenuItems: number;
  recentOrders: any[];
  orderStatusSummary: OrderStatusSummary[];
  topMenuItems: TopMenuItem[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const params = new URLSearchParams();
        if (startDate) {
          params.append('startDate', startDate.toISOString());
        }
        if (endDate) {
          params.append('endDate', endDate.toISOString());
        }

        const response = await orderService.getDashboardStats(params.toString());
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  const completedOrders = stats?.orderStatusSummary.find(s => s.status === 'completed');
  const cancelledOrders = stats?.orderStatusSummary.find(s => s.status === 'cancelled');

  if (isLoading) {
    return (
      <PageBackground>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </PageBackground>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'delivered':
        return 'success';
      case 'ready':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <PageBackground>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, md: 0 } }}>
            Admin Dashboard
          </Typography>
          <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
            <Typography
              variant="button"
              sx={{
                color: 'primary.main',
                '&:hover': { color: 'primary.dark' },
              }}
            >
              View all orders
            </Typography>
          </Link>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <DatePicker
              label="From Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slots={{ textField: TextField }}
              slotProps={{
                textField: { size: 'small' }
              }}
            />
            <DatePicker
              label="To Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slots={{ textField: TextField }}
              slotProps={{
                textField: { size: 'small' }
              }}
            />
          </Box>
        </LocalizationProvider>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Orders (All Time/Filtered)
              </Typography>
              <Typography variant="h4" color="primary">
                {stats?.totalOrders || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Revenue (All Time/Filtered)
              </Typography>
              <Typography variant="h4" color="primary">
                ₹{(stats?.totalRevenue || 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Completed Orders
              </Typography>
              <Typography variant="h4" color="success">
                {completedOrders?.count || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Revenue from Completed Orders
              </Typography>
              <Typography variant="h4" color="success">
                ₹{(completedOrders?.totalRevenue || 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Cancelled Orders
              </Typography>
              <Typography variant="h4" color="error">
                {cancelledOrders?.count || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4" color="primary">
                {stats?.totalUsers || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Menu Items
              </Typography>
              <Typography variant="h4" color="primary">
                {stats?.totalMenuItems || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Order Status Summary
              </Typography>
              <Grid container spacing={2}>
                {stats?.orderStatusSummary.map((statusData) => (
                  <Grid item xs={6} key={statusData.status}>
                    <Typography variant="body1">
                      <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{statusData.status}</span>: {statusData.count} Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: ₹{statusData.totalRevenue.toFixed(2)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Top 5 Selling Menu Items
              </Typography>
              <Grid container spacing={2}>
                {stats?.topMenuItems.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Typography variant="body1">
                      {item.name} ({item.totalQuantity} sold)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Revenue: ₹{item.totalRevenue.toFixed(2)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageBackground>
  );
};

export default AdminDashboard; 
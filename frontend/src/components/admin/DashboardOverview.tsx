import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

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

interface DashboardOverviewProps {
  stats: DashboardStats;
  loading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, loading }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffa726';
      case 'preparing':
        return '#29b6f6';
      case 'ready':
        return '#66bb6a';
      case 'delivered':
        return '#66bb6a';
      case 'cancelled':
        return '#ef5350';
      default:
        return '#757575';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Total Sales
            </Typography>
            <Typography variant="h4" color="primary" sx={{ color: '#ff5757' }}>
              ₹{stats.totalSales.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Total Orders
            </Typography>
            <Typography variant="h4" color="primary" sx={{ color: '#ff5757' }}>
              {stats.totalOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Average Order Value
            </Typography>
            <Typography variant="h4" color="primary" sx={{ color: '#ff5757' }}>
              ₹{stats.averageOrderValue.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.salesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="#ff5757"
                    name="Sales (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#29b6f6"
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Orders
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/admin/orders')}
                sx={{ color: '#ff5757', borderColor: '#ff5757', '&:hover': { borderColor: '#e04a4a' } }}
              >
                View All Orders
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(order.status),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          sx={{ color: '#ff5757' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 
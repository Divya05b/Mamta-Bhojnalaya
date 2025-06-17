import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  ButtonGroup,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';

interface SalesData {
  date: string;
  totalSales: number;
  orderCount: number;
}

interface CategorySales {
  category: string;
  sales: number;
}

const SalesReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/admin/sales?timeRange=${timeRange}`);
      setSalesData(response.data.salesData);
      setCategorySales(response.data.categorySales);
      setTotalRevenue(response.data.totalRevenue);
      setTotalOrders(response.data.totalOrders);
    } catch (err) {
      setError('Failed to fetch sales data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Sales Report
        </Typography>
        <ButtonGroup variant="contained" aria-label="Time range selection">
          <Button
            onClick={() => setTimeRange('daily')}
            color={timeRange === 'daily' ? 'primary' : 'inherit'}
          >
            Daily
          </Button>
          <Button
            onClick={() => setTimeRange('weekly')}
            color={timeRange === 'weekly' ? 'primary' : 'inherit'}
          >
            Weekly
          </Button>
          <Button
            onClick={() => setTimeRange('monthly')}
            color={timeRange === 'monthly' ? 'primary' : 'inherit'}
          >
            Monthly
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h3" color="primary" fontWeight={700}>
              ₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h3" color="secondary" fontWeight={700}>
              {totalOrders}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sales Trend
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalSales" stroke="#8884d8" name="Sales (₹)" />
              <Line type="monotone" dataKey="orderCount" stroke="#82ca9d" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sales by Category
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default SalesReport; 
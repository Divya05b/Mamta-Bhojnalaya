import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  phone: string;
  address: string;
  items: OrderItem[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
  };
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [orderToUpdateId, setOrderToUpdateId] = useState<number | null>(null);
  const [newStatusToApply, setNewStatusToApply] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrderToUpdateId(orderId);
    setNewStatusToApply(newStatus);
    setConfirmDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (orderToUpdateId === null || newStatusToApply === null) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderToUpdateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatusToApply }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      fetchOrders(); // Re-fetch orders to get the updated status
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setConfirmDialogOpen(false);
      setOrderToUpdateId(null);
      setNewStatusToApply(null);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setOrderToUpdateId(null);
    setNewStatusToApply(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'ready':
        return 'success';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'success'; // Added completed status color
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{order.user.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.user.email}
                    </Typography>
                    <Typography variant="caption" display="block" color="textSecondary">
                      {order.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <Typography key={item.menuItemId} variant="body2">
                      {item.menuItem.name} x {item.quantity}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell>₹{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as string)}
                        label="Status"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="ready">Ready</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography id="confirm-dialog-description">
            Are you sure you want to change the status of Order #{orderToUpdateId} to {newStatusToApply}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmStatusChange} color="primary" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderManagement; 
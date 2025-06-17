import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, List, ListItem, ListItemText, Divider, Paper, Select, MenuItem, Button, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Chip } from '@mui/material';
import { orderService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  menuItem: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  paymentMethod: string;
  orderType: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = isAdmin 
          ? await orderService.getAllOrders()
          : await orderService.getUserOrders();
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCancelClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedOrderId) {
      try {
        await orderService.cancelOrder(selectedOrderId);
        setOrders(orders.map(order => 
          order.id === selectedOrderId ? { ...order, status: 'cancelled' } : order
        ));
        setCancelDialogOpen(false);
        setSelectedOrderId(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const handleDeleteClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOrderId) {
      try {
        await orderService.deleteOrder(selectedOrderId);
        setOrders(orders.filter(order => order.id !== selectedOrderId));
        setDeleteDialogOpen(false);
        setSelectedOrderId(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const canCancelOrder = (order: Order) => {
    return isAdmin && order.status === 'pending';
  };

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
        return 'success'; // Assuming delivered is also a successful state
      case 'ready':
        return 'info'; // Assuming ready is also a state of progress
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {isAdmin ? 'All Orders' : 'Your Orders'}
      </Typography>
      {orders.length === 0 ? (
        <Alert severity="info">No orders found.</Alert>
      ) : (
        <List>
          {orders.map((order) => {
            console.log('Order status:', order.status);
            return (
              <Paper key={order.id} sx={{ mb: 3, p: 3, boxShadow: 3 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">Order ID: #{order.id}</Typography>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Total: ₹{order.total.toFixed(2)} - Ordered On: {new Date(order.createdAt).toLocaleDateString()}
                      <br />
                      Payment Method: {order.paymentMethod} - Order Type: {order.orderType}
                    </Typography>
                  }
                />
                {isAdmin && (
                  <>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Update Status</InputLabel>
                        <Select
                          value={order.status}
                          label="Update Status"
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingStatus === order.id}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      {order.status === 'pending' && (
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => handleCancelClick(order.id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(order.id)}
                      >
                        Delete Order
                      </Button>
                    </Box>
                  </>
                )}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Items:
                </Typography>
                <List dense disablePadding>
                  {order.items.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={`${item.menuItem.name} x ${item.quantity}`}
                        secondary={`₹${(item.menuItem.price * item.quantity).toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            );
          })}
        </List>
      )}

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Order</Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained">
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage; 
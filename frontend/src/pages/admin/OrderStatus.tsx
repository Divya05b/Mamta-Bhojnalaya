import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface Order {
  id: number;
  userId: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    id: number;
    menuItem: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  deliveryDetails: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    specialInstructions?: string;
  };
}

const OrderStatus: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      await axios.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PREPARING':
        return 'info';
      case 'READY':
        return 'success';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
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
          Order Management
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Filter by Status"
            onChange={(e) => setSelectedStatus(e.target.value as string)}
          >
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PREPARING">Preparing</MenuItem>
            <MenuItem value="READY">Ready</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No orders found.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.user.email}</Typography>
                  </TableCell>
                  <TableCell>₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={order.status} color={getStatusColor(order.status) as any} size="small" />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="PREPARING">Preparing</MenuItem>
                        <MenuItem value="READY">Ready</MenuItem>
                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleViewDetails(order)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!selectedOrder} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>Order #{selectedOrder.id} Details</DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6" gutterBottom>Customer Details</Typography>
              <Typography>Name: {selectedOrder.user.name}</Typography>
              <Typography>Email: {selectedOrder.user.email}</Typography>
              <Typography>Phone: {selectedOrder.user.phone}</Typography>

              <Box mt={3}>
                <Typography variant="h6" gutterBottom>Delivery Details</Typography>
                <Typography>Address: {selectedOrder.deliveryDetails.address}</Typography>
                <Typography>City: {selectedOrder.deliveryDetails.city}</Typography>
                <Typography>State: {selectedOrder.deliveryDetails.state}</Typography>
                <Typography>Zip Code: {selectedOrder.deliveryDetails.zipCode}</Typography>
                <Typography>Phone: {selectedOrder.deliveryDetails.phone}</Typography>
                {selectedOrder.deliveryDetails.specialInstructions && (
                  <Typography>Special Instructions: {selectedOrder.deliveryDetails.specialInstructions}</Typography>
                )}
              </Box>

              <Box mt={3}>
                <Typography variant="h6" gutterBottom>Order Items</Typography>
                <List>
                  {selectedOrder.items.map((item) => (
                    <ListItem key={item.id} disableGutters>
                      <ListItemText
                        primary={`${item.menuItem.name} x ${item.quantity}`}
                        secondary={`₹${(item.menuItem.price * item.quantity).toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6">₹{selectedOrder.total.toFixed(2)}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrderStatus; 
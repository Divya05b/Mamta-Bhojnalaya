import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
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
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  deliveryDetails: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    specialInstructions?: string;
  };
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await orderService.getUserOrders();
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const getStatusColor = (status: string) => {
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

  const canCancelOrder = (order: Order) => {
    return order.status === 'PENDING' || order.status === 'PREPARING';
  };

  const handleCancelClick = (order: Order) => {
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;

    setCancelling(true);
    try {
      await orderService.cancelOrder(orderToCancel.id);
      // Update the orders list with the cancelled order
      setOrders(orders.map(order => 
        order.id === orderToCancel.id 
          ? { ...order, status: 'CANCELLED' }
          : order
      ));
      setCancelDialogOpen(false);
      setOrderToCancel(null);
    } catch (err) {
      setError('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setOrderToCancel(null);
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (!user) {
    return null;
  }

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
          My Orders
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={handleStatusFilterChange}
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
            No orders found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewOrder(order)}
                      >
                        View Details
                      </Button>
                      {canCancelOrder(order) && (
                        <Tooltip title="Cancel Order">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleCancelClick(order)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order #{selectedOrder.id} Details
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Items
                  </Typography>
                  <List>
                    {selectedOrder.items.map((item) => (
                      <ListItem key={item.id}>
                        <ListItemAvatar>
                          <Avatar src={item.menuItem.imageUrl} alt={item.menuItem.name} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.menuItem.name}
                          secondary={`Quantity: ${item.quantity}`}
                        />
                        <Typography variant="body2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${selectedOrder.total.toFixed(2)}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Delivery Details
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" paragraph>
                      {selectedOrder.deliveryDetails.address}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedOrder.deliveryDetails.city}, {selectedOrder.deliveryDetails.state} {selectedOrder.deliveryDetails.zipCode}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Phone: {selectedOrder.deliveryDetails.phone}
                    </Typography>
                    {selectedOrder.deliveryDetails.specialInstructions && (
                      <Typography variant="body2" color="text.secondary">
                        Special Instructions: {selectedOrder.deliveryDetails.specialInstructions}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseOrderDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelClose}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel order #{orderToCancel?.id}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} disabled={cancelling}>
            No, Keep Order
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders; 
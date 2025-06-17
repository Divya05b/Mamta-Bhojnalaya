import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid,
  DialogContentText,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { orderService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    address: '',
    phone: '',
    paymentMethod: 'cash',
    orderType: 'delivery',
  });

  const defaultImage = '/images/default-food.jpg';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, [user, navigate, fetchCart]);

  const handleOrderSubmit = async () => {
    try {
      const orderData = {
        items: cartItems.map((item: CartItem) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
        ...orderDetails,
      };

      await orderService.createOrder(orderData);
      await clearCart();
      setOrderDialogOpen(false);
      navigate('/order-success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => total + (item.menuItem.price * item.quantity), 0);
  };

  const deliveryCharge = 0;
  const finalTotal = calculateTotal() + deliveryCharge;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        Your Shopping Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <List>
                {cartItems.map((item: CartItem) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box
                          component="img"
                          src={item.menuItem.image || defaultImage}
                          alt={item.menuItem.name}
                          sx={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover', mr: 2 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {item.menuItem.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ₹{item.menuItem.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mx: 3 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            sx={{
                              bgcolor: '#fcecec',
                              color: '#ff5757',
                              '&:hover': { bgcolor: '#fcecec' },
                              borderRadius: '5px',
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 1.5, fontWeight: 'bold' }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{
                              bgcolor: '#fcecec',
                              color: '#ff5757',
                              '&:hover': { bgcolor: '#fcecec' },
                              borderRadius: '5px',
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 80, textAlign: 'right' }}>
                          Total : ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                          sx={{ ml: 2 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {cartItems.indexOf(item) < cartItems.length - 1 && <Divider component="li" variant="inset" sx={{ ml: 0 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#fff', bgcolor: '#ff5757', p: 2, borderRadius: '8px 8px 0 0', m: -3, mb: 3 }}>
                Price Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary">Cart Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{calculateTotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">Delivery Charge</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{deliveryCharge.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>₹{finalTotal.toFixed(2)}</Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setOrderDialogOpen(true)}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  bgcolor: '#ff5757',
                  '&:hover': { bgcolor: '#e04a4a' },
                }}
              >
                Place Order
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog open={orderDialogOpen} onClose={() => setOrderDialogOpen(false)}>
        <DialogTitle>Place Your Order</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide your delivery details and select a payment method.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Delivery Address"
            type="text"
            fullWidth
            variant="outlined"
            name="address"
            value={orderDetails.address}
            onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
            name="phone"
            value={orderDetails.phone}
            onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={orderDetails.paymentMethod}
              label="Payment Method"
              onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value as string })}
            >
              <MenuItem value="cash">Cash on Delivery</MenuItem>
              <MenuItem value="card">Card (Coming Soon)</MenuItem>
              <MenuItem value="upi">UPI (Coming Soon)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Order Type</InputLabel>
            <Select
              value={orderDetails.orderType}
              label="Order Type"
              onChange={(e) => setOrderDetails({ ...orderDetails, orderType: e.target.value as string })}
            >
              <MenuItem value="delivery">Delivery</MenuItem>
              <MenuItem value="pickup">Pickup</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <List dense>
              {cartItems.map((item: CartItem) => (
                <ListItem key={item.id} disableGutters>
                  <ListItemText
                    primary={`${item.menuItem.name} x ${item.quantity}`}
                    secondary={`₹${(item.menuItem.price * item.quantity).toFixed(2)}`}
                  />
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem disableGutters>
                <ListItemText primary="Cart Total" />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{calculateTotal().toFixed(2)}</Typography>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="Delivery Charge" />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>₹{deliveryCharge.toFixed(2)}</Typography>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="Total Payable" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff5757' }}>₹{finalTotal.toFixed(2)}</Typography>
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleOrderSubmit} color="primary" variant="contained">Place Order</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage; 
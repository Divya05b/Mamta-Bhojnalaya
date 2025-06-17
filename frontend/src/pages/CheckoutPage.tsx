import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { cartService } from '../services/api';
import { orderService } from '../services/api';

interface CartItem {
  id: number;
  menuItem: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderType, setOrderType] = useState('takeaway');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart();
        setCartItems(response.data.items);
      } catch (err: any) {
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          id: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price
        })),
        paymentMethod: 'COD',
        orderType: orderType
      };

      await orderService.createOrder(orderData);
      await cartService.clearCart();
      navigate('/orders', { state: { orderSuccess: true } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Type
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <FormControlLabel
              value="takeaway"
              control={<Radio />}
              label="Takeaway"
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <List>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemText
                  primary={item.menuItem.name}
                  secondary={`Quantity: ${item.quantity}`}
                />
                <Typography>
                  ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="h6">
            Total: ₹{calculateTotal().toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <Typography>Cash on Delivery (COD)</Typography>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/menu')}
          disabled={submitting}
        >
          Back to Menu
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={submitting || cartItems.length === 0}
        >
          {submitting ? <CircularProgress size={24} /> : 'Place Order'}
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutPage; 
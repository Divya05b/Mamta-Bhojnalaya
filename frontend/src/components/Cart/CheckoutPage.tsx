import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const currentCartItems = useMemo(() => Array.isArray(cartItems) ? cartItems : [], [cartItems]);

  console.log('CheckoutPage - currentCartItems (after check):', currentCartItems);

  useEffect(() => {
    if (!currentCartItems || currentCartItems.length === 0) {
      console.log('Cart is empty in useEffect, navigating to menu.');
      navigate('/menu');
    }
  }, [currentCartItems, navigate]);

  let total = 0;
  if (currentCartItems.length > 0) {
    try {
      total = currentCartItems.reduce((sum: number, item) => {
        if (!item || !item.menuItem || typeof item.menuItem.price !== 'number' || typeof item.quantity !== 'number') {
          console.error('Invalid item in cart for total calculation:', item);
          return sum; // Skip invalid items
        }
        return sum + (item.menuItem.price * item.quantity);
      }, 0);
    } catch (calcError: any) {
      console.error('Error calculating total:', calcError);
      setError('Error calculating order total. Please refresh.');
      return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h5">
            Error loading checkout details.
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        </Box>
      );
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      if (!address || !phone) {
        throw new Error('Please provide both address and phone number');
      }

      const orderData = {
        address,
        phone,
        paymentMethod: 'cash_on_delivery', // Default for now
        orderType: 'delivery', // Default for now
        items: currentCartItems.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
      };

      console.log('Placing order with data:', orderData);
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      console.log('Order placement response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to place order');
      }

      clearCart();
      setSuccess(true);
      navigate(`/order-success/${responseData.id}`);
    } catch (err: any) {
      console.error('Error during order placement:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  if (currentCartItems.length === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty. Please add items to proceed to checkout.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/menu')}
        >
          Go to Menu
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Delivery Address"
          multiline
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          margin="normal"
          required
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {currentCartItems.map((item) => (
          <Box key={item.menuItem.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">{item.menuItem.name} x {item.quantity}</Typography>
            <Typography variant="body1">₹{(item.menuItem.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total: ₹{total.toFixed(2)}
        </Typography>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/cart')}
        >
          Back to Cart
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={loading || currentCartItems.length === 0}
          fullWidth
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage; 
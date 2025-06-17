import React, { useEffect, useState } from 'react';
import { cartService } from '../../services/api';
import CartItem from './CartItem';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface CartItemType {
  id: number;
  menuItem: MenuItem;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      setCartItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      await cartService.updateCartItem(itemId, newQuantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading cart...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Your cart is empty</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/menu')}
            sx={{ mt: 2 }}
          >
            Browse Menu
          </Button>
        </Paper>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={{
                id: item.id.toString(),
                name: item.menuItem.name,
                price: item.menuItem.price,
                quantity: item.quantity,
                image: item.menuItem.image,
              }}
              onQuantityChange={(id, quantity) => handleQuantityChange(parseInt(id), quantity)}
              onRemove={(id) => handleRemoveItem(parseInt(id))}
            />
          ))}

          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Cart; 
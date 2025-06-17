import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <Container>
        <Box py={4} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Cart
        </Typography>
        <List>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    src={item.menuItem.image || '/placeholder-food.jpg'}
                    alt={item.menuItem.name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.menuItem.name}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        ${item.menuItem.price.toFixed(2)} x {item.quantity}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Total: ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </Typography>
                    </>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                    sx={{ ml: 1 }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 4, textAlign: 'right' }}>
          <Typography variant="h6" gutterBottom>
            Total: ${totalAmount.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CartPage; 
import React from 'react';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartIcon: React.FC = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const count = cartItems.reduce((sum: number, item) => sum + item.quantity, 0);

  return (
    <IconButton color="inherit" onClick={() => navigate('/cart')}>
      <Badge badgeContent={count} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartIcon; 
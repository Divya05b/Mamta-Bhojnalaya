import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          {process.env.REACT_APP_APP_NAME || 'Restaurant'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>

          {user && user.role === 'admin' ? (
            null // Do not render Menu button for admin
          ) : (
            <Button color="inherit" component={RouterLink} to="/menu">
              Menu
            </Button>
          )}

          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin/dashboard">
                    Dashboard
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/menu">
                    Manage Menu
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/orders">
                    Orders
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/my-orders">
                    My Orders
                  </Button>
                  <IconButton 
                    color="inherit" 
                    component={RouterLink} 
                    to="/cart"
                    sx={{ ml: 1 }}
                  >
                    <Badge badgeContent={cartItemCount} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
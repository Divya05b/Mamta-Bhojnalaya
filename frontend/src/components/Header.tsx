import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCartItems = cartItems.reduce((total: number, item) => total + item.quantity, 0);

  return (
    <AppBar position="static" color="primary" elevation={0} sx={{
      bgcolor: '#fff',
      py: 1,
      borderBottom: '1px solid #eee',
    }}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, fontWeight: 700 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
              component="img"
              src="/images/logo.png"
              alt={`${process.env.REACT_APP_APP_NAME || 'Restaurant'} Logo`}
              sx={{ height: 40 }}
            />
          </RouterLink>
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {isAdmin ? (
            <>
              <Button color="inherit" component={RouterLink} to="/" sx={{ color: '#000' }}>
                <HomeIcon />
              </Button>
              <Button color="inherit" component={RouterLink} to="/menu" sx={{ color: '#000' }}>Menu</Button>
              <Button color="inherit" component={RouterLink} to="/about" sx={{ color: '#000' }}>About Us</Button>
              <Button color="inherit" component={RouterLink} to="/service" sx={{ color: '#000' }}>Service</Button>
              <Button color="inherit" component={RouterLink} to="/admin" sx={{ color: '#000' }}>Admin</Button>
              <Button color="inherit" onClick={handleLogout} sx={{ color: '#000' }}>Logout</Button>
              <Button color="inherit" component={RouterLink} to="/profile" sx={{ color: '#000' }}>
                <AccountCircle />
              </Button>
            </>
          ) : user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/" sx={{ color: '#000' }}>Home</Button>
              <Button color="inherit" component={RouterLink} to="/menu" sx={{ color: '#000' }}>Menu</Button>
              <Button color="inherit" component={RouterLink} to="/contact" sx={{ color: '#000' }}>Contact Us</Button>
              <Button color="inherit" component={RouterLink} to="/orders" sx={{ color: '#000' }}>My Orders</Button>
              <IconButton 
                color="inherit" 
                component={RouterLink} 
                to="/cart"
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={totalCartItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Button color="inherit" onClick={handleLogout} sx={{ color: '#000' }}>Logout</Button>
              <Button color="inherit" component={RouterLink} to="/profile" sx={{ color: '#000' }}>
                <AccountCircle />
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/" sx={{ color: '#000' }}>Home</Button>
              <Button color="inherit" component={RouterLink} to="/menu" sx={{ color: '#000' }}>Menu</Button>
              <Button color="inherit" component={RouterLink} to="/contact" sx={{ color: '#000' }}>Contact Us</Button>
              <Button color="inherit" component={RouterLink} to="/login" sx={{ color: '#000' }}>Login</Button>
              <Button color="inherit" component={RouterLink} to="/register" sx={{ color: '#000' }}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
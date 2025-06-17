import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        color: '#000',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" sx={{ mb: 1 }}>
          {'© '}
          {new Date().getFullYear()}
          {` ${process.env.REACT_APP_APP_NAME || 'Restaurant'}. All rights reserved.`}
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link color="inherit" href="/contact" sx={{ textDecoration: 'none', mr: 1, color: '#000' }}>
            Contact Us
          </Link>
          {' | '}
          <Link color="inherit" href="/menu" sx={{ textDecoration: 'none', ml: 1, color: '#000' }}>
            Menu
          </Link>
        </Typography>
      </Container>
      <Box sx={{ mt: 2, bgcolor: '#eee', py: 1 }}>
        <Typography variant="caption" align="center" sx={{ color: '#555' }}>
          Made by Amit Prajapati
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer; 
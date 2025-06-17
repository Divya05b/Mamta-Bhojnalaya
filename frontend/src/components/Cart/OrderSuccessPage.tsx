import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Thank you for your order. We will process it shortly.
        </Typography>
        <Button variant="contained" color="primary" sx={{ bgcolor: '#ff5757' }} onClick={() => navigate('/menu')}>
          Return to Menu
        </Button>
      </Paper>
    </Box>
  );
};

export default OrderSuccessPage; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: 'success.main',
            mb: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your order. We have received your order and will begin preparing it right away.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You will receive an email confirmation with your order details shortly.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/menu')}
          >
            Back to Menu
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess; 
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1">
          Welcome to the admin dashboard. This page is under construction.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminPage; 
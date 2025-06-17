import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { MenuItem } from '../contexts/CartContext';
import MenuItemComponent from '../components/Menu/MenuItem';
import { Container, Grid, Typography, Box } from '@mui/material';

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading menu items...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Our Menu
        </Typography>
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <MenuItemComponent {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default MenuPage; 
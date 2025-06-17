import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Button } from '@mui/material';
import { menuService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchFilter from '../components/SearchFilter';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
}

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, items, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await menuService.getMenuItems();
        setMenuItems(response.data);
        setFilteredItems(response.data);
        const uniqueCategories = Array.from(
          new Set(response.data.map((item: MenuItem) => item.category))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleSearch = (query: string) => {
    const searchResults = menuItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(searchResults);
  };

  const handleFilter = (category: string) => {
    if (category === '') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item => item.category === category);
      setFilteredItems(filtered);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addItem({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      image: item.imageUrl,
    });
  };

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Our Menu
      </Typography>

      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        categories={categories}
      />

      <Grid container spacing={4}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id.toString()}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              {item.imageUrl && (
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.name}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
              )}
              <Box sx={{ p: 3, flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${item.price.toFixed(2)}
                </Typography>
                <div className="flex gap-2">
                  {item.isVegetarian && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Vegetarian
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      Spicy
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable}
                    className={`px-4 py-2 rounded-lg ${
                      item.isAvailable
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.isAvailable ? 'Add to Cart' : 'Not Available'}
                  </button>
                </div>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No menu items found matching your criteria.</p>
        </div>
      )}

      {items.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            boxShadow: 3,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            Total: ${totalPrice.toFixed(2)} ({items.length} items)
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            disabled={!user}
          >
            {user ? 'Place Order' : 'Login to Order'}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MenuPage; 
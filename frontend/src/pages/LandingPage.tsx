import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardMedia, CardContent, CircularProgress, Paper, Stack } from '@mui/material';
import { menuService } from '../services/api';
import TestimonialList from '../components/Testimonials/TestimonialList';
import { useNavigate } from 'react-router-dom';
import MopedIcon from '@mui/icons-material/Moped';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IMAGES } from '../constants/images';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

const LandingPage: React.FC = () => {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await menuService.getMenuItems();
        setFeatured(res.data.slice(0, 4));
      } catch (e) {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${IMAGES.RESTAURANT_AMBIANCE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: { xs: 4, md: 0 } }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    bgcolor: '#fcecec',
                    color: '#ff5757',
                    borderRadius: '20px',
                    px: 2,
                    py: 1,
                    mb: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#fcecec', boxShadow: 'none' }
                  }}
                >
                  Tasty Food Guaranteed
                </Button>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' } }}>
                  Authentic Indian <Box component="span" sx={{ color: '#ff5757' }}>Flavors</Box>
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, maxWidth: '500px', fontSize: '1.2rem' }}>
                  Experience the rich taste of traditional Indian cuisine, prepared with love and served with warmth.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    bgcolor: '#ff5757',
                    color: '#fff',
                    borderRadius: '8px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#e04a4a' }
                  }}
                  onClick={() => navigate('/menu')}
                >
                  Order Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#333' }}>
                Welcome to {process.env.REACT_APP_APP_NAME || 'Restaurant'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', color: '#666' }}>
                We take pride in serving authentic Indian cuisine that brings the rich flavors and traditions of India to your table. Our chefs use traditional recipes and the finest ingredients to create memorable dining experiences.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <RestaurantIcon sx={{ fontSize: 40, color: '#ff5757' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>Authentic Taste</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <LocationOnIcon sx={{ fontSize: 40, color: '#ff5757' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>Prime Location</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <AccessTimeIcon sx={{ fontSize: 40, color: '#ff5757' }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>24/7 Service</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={IMAGES.RESTAURANT_INTERIOR}
                alt="Restaurant Interior"
                sx={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Dishes Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6, color: '#333' }}>
            Our Signature Dishes
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {featured.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}>
                    {item.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt={item.name}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700, color: '#ff5757' }}>
                        ₹{item.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6, color: '#333' }}>
            What Our Customers Say
          </Typography>
          <TestimonialList />
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#333' }}>
                Visit Us
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ fontSize: 30, color: '#ff5757', mr: 2 }} />
                  <Typography variant="body1">
                    123 Restaurant Street, Food City, FC 12345
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ fontSize: 30, color: '#ff5757', mr: 2 }} />
                  <Typography variant="body1">
                    +91 123 456 7890
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ fontSize: 30, color: '#ff5757', mr: 2 }} />
                  <Typography variant="body1">
                    Open Daily: 11:00 AM - 11:00 PM
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: '12px' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Get in Touch
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    bgcolor: '#ff5757',
                    color: '#fff',
                    py: 1.5,
                    '&:hover': { bgcolor: '#e04a4a' }
                  }}
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#ff5757', color: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ready to Experience Authentic Indian Cuisine?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem' }}>
            Order now and get 10% off on your first order!
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{
              mt: 3,
              px: 6,
              py: 1.5,
              fontSize: '1.2rem',
              borderColor: 'white',
              '&:hover': { bgcolor: 'white', color: '#ff5757' }
            }}
            onClick={() => navigate('/menu')}
          >
            Order Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Rating, TextField, Button, Alert, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Testimonial {
  id: number;
  userId: number;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

const Testimonials: React.FC = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    rating: 5,
    comment: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('/api/testimonials');
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setStatus({
        type: 'error',
        message: 'Please login to submit a testimonial',
      });
      return;
    }

    try {
      await axios.post('/api/testimonials', newTestimonial);
      setStatus({
        type: 'success',
        message: 'Thank you for your testimonial! It will be reviewed by our team.',
      });
      setNewTestimonial({ rating: 5, comment: '' });
      fetchTestimonials();
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to submit testimonial. Please try again later.',
      });
    }
  };

  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Customer Testimonials
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary" paragraph>
        Read what our customers have to say about their experience at {process.env.REACT_APP_APP_NAME || 'Restaurant'}
      </Typography>

      {/* Submit Testimonial Form */}
      {user && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 4,
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Share Your Experience
          </Typography>

          {status.type && (
            <Alert severity={status.type} sx={{ mb: 3 }}>
              {status.message}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={newTestimonial.rating}
              onChange={(_, value) => setNewTestimonial(prev => ({ ...prev, rating: value || 5 }))}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            label="Your Review"
            multiline
            rows={4}
            value={newTestimonial.comment}
            onChange={(e) => setNewTestimonial(prev => ({ ...prev, comment: e.target.value }))}
            required
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit Review
          </Button>
        </Box>
      )}

      {/* Display Testimonials */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {approvedTestimonials.map((testimonial) => (
          <Grid item xs={12} md={6} key={testimonial.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={testimonial.rating} readOnly />
                  <Typography variant="subtitle1" sx={{ ml: 2 }}>
                    {testimonial.user.name}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {testimonial.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {approvedTestimonials.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No testimonials yet. Be the first to share your experience!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Testimonials; 
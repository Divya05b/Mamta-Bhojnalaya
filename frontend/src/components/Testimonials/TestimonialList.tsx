import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Rating,
  Box,
  CircularProgress,
} from '@mui/material';
import { testimonialService } from '../../services/api';

interface Testimonial {
  id: number;
  rating: number;
  comment: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const TestimonialList: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<{
    averageRating: number;
    totalTestimonials: number;
    ratingDistribution: { rating: number; _count: { rating: number } }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsRes, statsRes] = await Promise.all([
          testimonialService.getTestimonials(),
          testimonialService.getTestimonialStats(),
        ]);
        setTestimonials(testimonialsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {stats && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Customer Reviews
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Box>
              <Typography variant="h6">Average Rating</Typography>
              <Rating
                value={stats.averageRating}
                precision={0.5}
                readOnly
                size="large"
              />
              <Typography variant="body2" color="text.secondary">
                {stats.averageRating.toFixed(1)}/5
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6">Total Reviews</Typography>
              <Typography variant="h4">{String(stats.totalTestimonials).padStart(4, '0')}</Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        {testimonials.map((testimonial) => (
          <Grid item xs={12} md={6} key={testimonial.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={testimonial.rating} readOnly />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {testimonial.comment}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  - {testimonial.user.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestimonialList; 
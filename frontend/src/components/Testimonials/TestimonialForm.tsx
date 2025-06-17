import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Rating,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { testimonialService } from '../../services/api';

interface TestimonialFormProps {
  onSuccess?: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSuccess }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingTestimonial, setExistingTestimonial] = useState<{
    id: number;
    rating: number;
    comment: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserTestimonial = async () => {
      try {
        const response = await testimonialService.getUserTestimonial();
        if (response.data) {
          setExistingTestimonial(response.data);
          setRating(response.data.rating);
          setComment(response.data.comment);
        }
      } catch (error) {
        console.error('Error fetching user testimonial:', error);
      }
    };

    fetchUserTestimonial();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    if (comment.length < 10) {
      setError('Comment must be at least 10 characters long');
      return;
    }

    setLoading(true);

    try {
      if (existingTestimonial) {
        await testimonialService.updateTestimonial({ rating, comment });
        setSuccess('Testimonial updated successfully');
      } else {
        await testimonialService.createTestimonial({ rating, comment });
        setSuccess('Testimonial submitted successfully');
      }

      setComment('');
      setRating(null);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingTestimonial) return;

    try {
      await testimonialService.deleteTestimonial();
      setExistingTestimonial(null);
      setRating(null);
      setComment('');
      setSuccess('Testimonial deleted successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('Failed to delete testimonial. Please try again.');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {existingTestimonial ? 'Edit Your Review' : 'Write a Review'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {existingTestimonial ? 'Update Review' : 'Submit Review'}
            </Button>

            {existingTestimonial && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Review
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm; 
import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Rating, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ReviewSubmissionPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a rating.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          rating,
          comment,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit review');
      setSuccess(true);
      setTimeout(() => navigate('/order-success'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Submit Review
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Order #{orderId}
        </Typography>
        <Box sx={{ my: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
          />
        </Box>
        <TextField
          label="Comment"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Review submitted successfully!</Alert>}
        <Button variant="contained" color="primary" sx={{ bgcolor: '#ff5757' }} onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Submit Review'}
        </Button>
      </Paper>
    </Box>
  );
};

export default ReviewSubmissionPage; 
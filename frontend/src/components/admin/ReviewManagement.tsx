import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  Grid,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  orderId?: number;
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };

  const handleStatusChange = async (reviewId: number, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review status');
      }

      // Update the review in the local state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, status: newStatus } : review
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Remove the review from the local state
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ffa726';
      case 'approved':
        return '#66bb6a';
      case 'rejected':
        return '#ef5350';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" sx={{ mb: 3 }}>
        Customer Reviews
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.customerName}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly size="small" />
                </TableCell>
                <TableCell>
                  {review.comment.length > 50
                    ? `${review.comment.substring(0, 50)}...`
                    : review.comment}
                </TableCell>
                <TableCell>
                  <Chip
                    label={review.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(review.status),
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewReview(review)}
                    sx={{ color: '#ff5757' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteReview(review.id)}
                    sx={{ color: '#ef5350' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedReview && (
          <>
            <DialogTitle>
              Review Details
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Customer Information
                  </Typography>
                  <Typography>Name: {selectedReview.customerName}</Typography>
                  {selectedReview.orderId && (
                    <Typography>Order ID: #{selectedReview.orderId}</Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Rating & Comment
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={selectedReview.rating} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({selectedReview.rating}/5)
                    </Typography>
                  </Box>
                  <Typography>{selectedReview.comment}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Review Status
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={selectedReview.status === 'approved' ? 'contained' : 'outlined'}
                      onClick={() => handleStatusChange(selectedReview.id, 'approved')}
                      sx={{
                        bgcolor: selectedReview.status === 'approved' ? '#66bb6a' : undefined,
                        color: selectedReview.status === 'approved' ? 'white' : undefined,
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant={selectedReview.status === 'rejected' ? 'contained' : 'outlined'}
                      onClick={() => handleStatusChange(selectedReview.id, 'rejected')}
                      sx={{
                        bgcolor: selectedReview.status === 'rejected' ? '#ef5350' : undefined,
                        color: selectedReview.status === 'rejected' ? 'white' : undefined,
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Review Timeline
                  </Typography>
                  <Typography>
                    Posted: {new Date(selectedReview.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReviewManagement; 
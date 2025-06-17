import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      await axios.post('/api/contact', formData);
      setStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Contact Us
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" paragraph>
        Have a question or feedback? We'd love to hear from you!
      </Typography>

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
        {status.type && (
          <Alert severity={status.type} sx={{ mb: 3 }}>
            {status.message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          multiline
          rows={4}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </Box>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Visit Us
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          123 Restaurant Street
          <br />
          Foodville, FL 12345
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Contact Information
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Phone: (123) 456-7890
          <br />
          Email: info@mamtabhojnalaya.com
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Business Hours
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monday - Friday: 11:00 AM - 10:00 PM
          <br />
          Saturday - Sunday: 10:00 AM - 11:00 PM
        </Typography>
      </Box>
    </Container>
  );
};

export default Contact; 
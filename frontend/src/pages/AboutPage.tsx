import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Button, TextField } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import PageBackground from '../components/PageBackground';

const AboutPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [content, setContent] = useState({
    title: "Welcome to " + (process.env.REACT_APP_APP_NAME || 'Restaurant') + "!",
    paragraph1: "At " + (process.env.REACT_APP_APP_NAME || 'Restaurant') + ", we believe in serving food that feels like a warm hug from home. Our journey began with a simple vision: to bring authentic, delicious, and wholesome meals to your table, crafted with love and the freshest ingredients.",
    paragraph2: "Every dish is prepared with traditional recipes passed down through generations, ensuring a taste that evokes nostalgia and comfort. From our aromatic curries to our freshly baked bread, we pour our heart into every creation, making sure each bite is a delightful experience. Come, be a part of our family, and savor the true flavors of home-cooked goodness!",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // In a real application, you would fetch this content from a backend API
  // For now, we're using static content.
  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      // In a real app: fetch from API
      // const fetchedContent = await contentService.getAboutPageContent();
      // setContent(fetchedContent);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    // In a real application, you would send this updated content to a backend API
    console.log('Saving content:', content);
    setLoading(true);
    setTimeout(() => {
      // Simulate API call success/failure
      // await contentService.updateAboutPageContent(content);
      setLoading(false);
      setIsEditing(false);
      alert('Content updated successfully!');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <PageBackground>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
          <CircularProgress />
        </Box>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
            {isEditing ? (
              <TextField
                name="title"
                value={content.title}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            ) : (
              content.title
            )}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#555' }}>
            {isEditing ? (
              <TextField
                name="paragraph1"
                value={content.paragraph1}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                margin="normal"
              />
            ) : (
              content.paragraph1
            )}
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#555' }}>
            {isEditing ? (
              <TextField
                name="paragraph2"
                value={content.paragraph2}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                margin="normal"
              />
            ) : (
              content.paragraph2
            )}
          </Typography>
        </Box>

        {isAdmin && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={handleSave} disabled={loading} sx={{ mr: 2, bgcolor: '#ff5757', '&:hover': { bgcolor: '#e04a4a' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ bgcolor: '#ff5757', '&:hover': { bgcolor: '#e04a4a' } }}>
                Edit About Us Content
              </Button>
            )}
          </Box>
        )}
      </Container>
    </PageBackground>
  );
};

export default AboutPage; 
import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';


const Footer: React.FC = () => {
    const developerName = process.env.REACT_APP_DEVELOPER_NAME || 'Your Name';

    return (
        <Box
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 3,
                mt: 'auto', // Pushes the footer to the bottom of the page
                width: '100%',
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2">
                    <CodeIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Developed with <FavoriteIcon sx={{ verticalAlign: 'middle', mx: 0.5 }} /> by {developerName}
                </Typography>
                <Typography variant="caption" sx={{ mt: 1 }}>
                    © {new Date().getFullYear()} {process.env.REACT_APP_APP_NAME || 'Restaurant'}. All rights reserved.
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Link href="#" color="inherit" sx={{ mx: 1, textDecoration: 'none' }}>
                        Privacy Policy
                    </Link>
                    <Link href="#" color="inherit" sx={{ mx: 1, textDecoration: 'none' }}>
                        Terms of Service
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 
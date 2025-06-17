import React from 'react';
import { Box } from '@mui/material';

interface PageBackgroundProps {
  children: React.ReactNode;
  backgroundImage?: string;
  overlayColor?: string;
}

const PageBackground: React.FC<PageBackgroundProps> = ({
  children,
  backgroundImage = '/images/default-bg.jpg',
  overlayColor = 'rgba(0, 0, 0, 0.5)',
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageBackground; 
import React from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BarChartIcon from '@mui/icons-material/BarChart';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Overview', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Menu', icon: <RestaurantMenuIcon />, path: '/admin/menu' },
    { label: 'Orders', icon: <ReceiptLongIcon />, path: '/admin/orders' },
    { label: 'Analytics', icon: <BarChartIcon />, path: '/admin/analytics' },
    { label: 'Reviews', icon: <RateReviewIcon />, path: '/admin/reviews' },
  ];

  const currentTab = tabs.findIndex(tab => {
    // Handle /admin/dashboard explicitly as the overview tab
    if (tab.path === '/admin' && location.pathname === '/admin/dashboard') {
      return true;
    }
    return location.pathname === tab.path;
  });

  // Fallback to 0 if no match, to avoid -1
  const activeTabIndex = currentTab === -1 ? 0 : currentTab;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar */}
      {/* <Paper
        elevation={0}
        sx={{
          width: isMobile ? '100%' : 240,
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          height: isMobile ? 'auto' : '100vh',
          borderRight: '1px solid',
          borderColor: 'divider',
          zIndex: theme.zIndex.appBar,
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#ff5757', fontWeight: 600 }}>
            Admin Dashboard
          </Typography>
          <Tabs
            orientation={isMobile ? 'horizontal' : 'vertical'}
            value={activeTabIndex}
            onChange={(_, newValue) => navigate(tabs[newValue].path)}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              '& .MuiTabs-indicator': {
                bgcolor: '#ff5757',
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.path}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{
                  minHeight: 48,
                  justifyContent: 'flex-start',
                  px: 2.5,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: '#ff5757',
                  },
                  '& .MuiSvgIcon-root': {
                    mr: 1,
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Paper> */}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%', // Make it full width
          ml: 0, // Remove left margin
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 
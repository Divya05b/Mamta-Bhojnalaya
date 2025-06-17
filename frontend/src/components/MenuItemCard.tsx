import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VegetarianIcon from '@mui/icons-material/EmojiFoodBeverage';
import SpicyIcon from '@mui/icons-material/LocalFireDepartment';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={item.image || '/images/default-food.jpg'}
          alt={item.name}
          sx={{ objectFit: 'cover' }}
        />
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          {item.isVegetarian && (
            <Chip
              icon={<VegetarianIcon />}
              label="Veg"
              size="small"
              sx={{
                bgcolor: 'rgba(76, 175, 80, 0.9)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          )}
          {item.isSpicy && (
            <Chip
              icon={<SpicyIcon />}
              label="Spicy"
              size="small"
              sx={{
                bgcolor: 'rgba(244, 67, 54, 0.9)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          )}
        </Stack>
        {(onEdit || onDelete) && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            {onEdit && (
              <IconButton
                size="small"
                onClick={onEdit}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { bgcolor: 'white' },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={onDelete}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { bgcolor: 'white' },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          {item.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, color: '#ff5757' }}>
            ₹{item.price.toFixed(2)}
          </Typography>
          <Chip
            label={item.category}
            size="small"
            sx={{
              bgcolor: '#f5f5f5',
              color: '#666',
              textTransform: 'capitalize',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard; 
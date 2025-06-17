import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  return (
    <Card sx={{ display: 'flex', mb: 2 }}>
      {item.image && (
        <Box
          sx={{
            width: 100,
            height: 100,
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${item.price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={item.quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                handleQuantityChange(value);
              }
            }}
            type="number"
            size="small"
            sx={{ width: 60 }}
            inputProps={{ min: 1, style: { textAlign: 'center' } }}
          />
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onRemove(item.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem; 
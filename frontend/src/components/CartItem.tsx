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
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(id, newQuantity);
    }
  };

  return (
    <Card sx={{ display: 'flex', mb: 2 }}>
      {image && (
        <Box
          sx={{
            width: 100,
            height: 100,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={quantity}
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
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onRemove(id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem; 
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { MenuItem as MenuItemType } from '../../contexts/CartContext';

interface MenuItemProps extends MenuItemType {
  onEdit?: (item: MenuItemType) => void;
  onDelete?: (id: number) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  price,
  image,
  category,
  isAvailable,
  isVegetarian,
  isSpicy,
  onEdit,
  onDelete,
}) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<MenuItemType>({
    id,
    name,
    description,
    price,
    image,
    category,
    isAvailable,
    isVegetarian,
    isSpicy,
  });

  console.log('MenuItem - isAdmin:', isAdmin);
  console.log('MenuItem - onEdit prop:', onEdit);

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      description,
      price,
      image,
      category,
      isAvailable,
      isVegetarian,
      isSpicy,
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
        id,
        name,
        description,
        price,
        category,
        image,
        isAvailable,
        isVegetarian,
        isSpicy
      });
    }
  };

  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
  };

  const handleSaveEdit = () => {
    onEdit?.(editedItem);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={image || '/placeholder-food.jpg'}
          alt={name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {isVegetarian && (
              <Chip label="Vegetarian" color="success" size="small" />
            )}
            {isSpicy && (
              <Chip label="Spicy" color="error" size="small" />
            )}
          </Stack>
          <Typography variant="h6" color="primary">
            ₹{price.toFixed(2)}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {isAdmin ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="primary" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              user ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Add to Cart' : 'Not Available'}
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Login to add to cart
                </Typography>
              )
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={editedItem.price}
              onChange={(e) => setEditedItem({ ...editedItem, price: parseFloat(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Category"
              value={editedItem.category}
              onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={editedItem.image || ''}
              onChange={(e) => setEditedItem({ ...editedItem, image: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editedItem.isAvailable}
                  onChange={(e) => setEditedItem({ ...editedItem, isAvailable: e.target.checked })}
                />
              }
              label="Available"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editedItem.isVegetarian}
                  onChange={(e) => setEditedItem({ ...editedItem, isVegetarian: e.target.checked })}
                />
              }
              label="Vegetarian"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editedItem.isSpicy}
                  onChange={(e) => setEditedItem({ ...editedItem, isSpicy: e.target.checked })}
                />
              }
              label="Spicy"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MenuItem; 
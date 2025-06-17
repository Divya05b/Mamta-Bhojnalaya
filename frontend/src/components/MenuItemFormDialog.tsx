import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem as MuiMenuItem,
  Select,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

interface MenuItemFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (itemData: FormData) => void;
  initialData?: MenuItemFormData | null; // For editing existing items
  loading?: boolean; // Keep optional
  error?: string | null; // Keep optional
  defaultCategories?: string[]; // Add defaultCategories prop
}

export interface MenuItemFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  customCategory?: string;
}

const MenuItemFormDialog: React.FC<MenuItemFormDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  loading,
  error,
  defaultCategories,
}) => {
  const [formData, setFormData] = useState<MenuItemFormData>(() => ({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    customCategory: '',
  }));

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isAvailable: Boolean(initialData.isAvailable ?? true),
        isVegetarian: Boolean(initialData.isVegetarian ?? false),
        isSpicy: Boolean(initialData.isSpicy ?? false),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        isAvailable: true,
        isVegetarian: false,
        isSpicy: false,
        customCategory: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && value !== 'Custom' && { customCategory: '' })
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      console.error('Missing required fields:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category
      });
      return;
    }

    // If category is Custom, ensure customCategory is provided
    if (formData.category === 'Custom' && !formData.customCategory) {
      console.error('Custom category name is required');
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('name', String(formData.name).trim());
    dataToSend.append('description', String(formData.description).trim());
    dataToSend.append('price', String(Number(formData.price)));
    dataToSend.append('category', formData.category === 'Custom' ? String(formData.customCategory).trim() : String(formData.category).trim());
    dataToSend.append('is_available', String(Boolean(formData.isAvailable)));
    dataToSend.append('is_vegetarian', String(Boolean(formData.isVegetarian)));
    dataToSend.append('is_spicy', String(Boolean(formData.isSpicy)));
    if (formData.image) {
      dataToSend.append('image', String(formData.image).trim());
    }

    console.log('MenuItemFormDialog - Submitting FormData:', Object.fromEntries(dataToSend.entries()));
    onSave(dataToSend);
  };

  // Dummy categories for now, replace with actual categories fetched from backend if available
  const categories = ['Main Course', 'Breads', 'Beverages', 'Desserts', 'Breakfast', 'Thali', 'Chicken', 'Fruits', 'Rice', 'Icecream', 'Fish', 'Strawberries', 'Drink', 'Curry'];

  // Combine default and existing categories, filter out duplicates, and sort alphabetically
  const allCategories = Array.from(new Set([...(defaultCategories || []), ...categories])).sort(); // Handle defaultCategories being undefined

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Item Name"
          type="text"
          fullWidth
          required
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          required
          multiline
          rows={3}
          variant="outlined"
          value={formData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="price"
          label="Price"
          type="number"
          fullWidth
          required
          variant="outlined"
          value={formData.price}
          onChange={handleNumberChange}
          inputProps={{ step: "0.01", min: "0" }}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="dense" required sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
            label="Category"
            onChange={handleSelectChange}
          >
            {allCategories.map((category) => (
              <MuiMenuItem key={category} value={category}>
                {category}
              </MuiMenuItem>
            ))}
            <MuiMenuItem value="Custom">Custom</MuiMenuItem>
          </Select>
        </FormControl>
        {formData.category === 'Custom' && (
          <TextField
            margin="dense"
            name="customCategory"
            label="Custom Category Name"
            type="text"
            fullWidth
            required
            variant="outlined"
            value={formData.customCategory || ''}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          margin="dense"
          name="image"
          label="Image URL"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.image || ''}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(formData.isAvailable)}
              onChange={handleSwitchChange}
              name="isAvailable"
              color="primary"
            />
          }
          label="Available"
          sx={{ mb: 1 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(formData.isVegetarian)}
              onChange={handleSwitchChange}
              name="isVegetarian"
              color="primary"
            />
          }
          label="Vegetarian"
          sx={{ mb: 1 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(formData.isSpicy)}
              onChange={handleSwitchChange}
              name="isSpicy"
              color="primary"
            />
          }
          label="Spicy"
          sx={{ mb: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>Cancel</Button>
        <Button 
          type="button"
          color="primary" 
          variant="contained" 
          disabled={loading || !formData.name || !formData.description || !formData.price || !formData.category}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : (initialData ? 'Save Changes' : 'Add Item')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemFormDialog; 
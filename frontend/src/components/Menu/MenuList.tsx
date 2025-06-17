import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  SelectChangeEvent,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import MenuItemFormDialog, { MenuItemFormData } from '../MenuItemFormDialog';

const defaultCategories = [
  'All',
  'Breakfast',
  'Main Course',
  'Breads',
  'Desserts',
  'Beverages',
  'Thali',
  'Custom',
];

const MenuList: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customCategory, setCustomCategory] = useState('');
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [searchTerm, selectedCategory, filters]);

  console.log('MenuList - isAdmin:', isAdmin);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      if (selectedCategory !== 'All') {
        queryParams.append('category', selectedCategory === 'Custom' ? customCategory : selectedCategory);
      }
      if (filters.vegetarian) {
        queryParams.append('isVegetarian', 'true');
      }
      if (filters.spicy) {
        queryParams.append('isSpicy', 'true');
      }

      const response = await fetch(`http://localhost:5000/api/menu?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedCategory(value);
    if (value !== 'Custom') {
      setCustomCategory('');
    }
  };

  const handleFilterChange = (filter: 'vegetarian' | 'spicy') => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleAddItem = async (itemData: FormData) => {
    try {
      console.log('MenuList - handleAddItem received data (FormData):', Object.fromEntries(itemData.entries()));

      // No need for manual validation here, as it's done in MenuItemFormDialog
      // No need to construct payload manually, as itemData is already FormData

      console.log('MenuList - Sending FormData to backend:', Object.fromEntries(itemData.entries()));
      console.log('Auth token:', localStorage.getItem('token'));

      const response = await fetch('http://localhost:5000/api/admin/menu', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json', // FormData automatically sets content-type
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: itemData, // Send FormData directly
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to add menu item');
      }

      await fetchMenuItems();
      setIsAddDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEditItem = async (item: MenuItemType) => {
    try {
      console.log('MenuList - handleEditItem received item:', item);

      const payload = {
        id: item.id,
        name: String(item.name).trim(),
        description: String(item.description).trim(),
        price: Number(item.price),
        category: String(item.category).trim(),
        image: item.image ? String(item.image).trim() : null,
        isAvailable: Boolean(item.isAvailable),
        isVegetarian: Boolean(item.isVegetarian),
        isSpicy: Boolean(item.isSpicy),
      };

      console.log('MenuList - Sending edit payload to backend:', payload);
      const response = await fetch(`http://localhost:5000/api/admin/menu/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Edit response status:', response.status);
      const responseData = await response.json();
      console.log('Edit response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update menu item');
      }

      await fetchMenuItems();
    } catch (err) {
      console.error('Error editing menu item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      console.log('Attempting to mark item as unavailable with ID:', id);
      const response = await fetch(`http://localhost:5000/api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Delete response status:', response.status);
      const responseData = await response.json();
      console.log('Delete response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to mark menu item as unavailable');
      }

      // Refresh the menu items list
      await fetchMenuItems();
    } catch (err) {
      console.error('Error marking menu item as unavailable:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading menu items...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Our Menu
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search Menu"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            {defaultCategories.map((category) => (
              <MuiMenuItem key={category} value={category}>
                {category}
              </MuiMenuItem>
            ))}
            {(!defaultCategories.includes(selectedCategory) && selectedCategory !== 'Custom' && selectedCategory !== 'All') && (
              <MuiMenuItem key={selectedCategory} value={selectedCategory}>
                {selectedCategory} (Current)
              </MuiMenuItem>
            )}
          </Select>
        </FormControl>
        {selectedCategory === 'Custom' && (
          <TextField
            label="Custom Category Name"
            variant="outlined"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            sx={{ minWidth: '180px' }}
          />
        )}
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.vegetarian}
                onChange={() => handleFilterChange('vegetarian')}
                name="vegetarian"
              />
            }
            label="Vegetarian"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filters.spicy}
                onChange={() => handleFilterChange('spicy')}
                name="spicy"
              />
            }
            label="Spicy"
          />
        </Stack>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add New Item
          </Button>
        )}
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>}
      {!loading && !error && menuItems.length === 0 && (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
          No menu items found.
        </Typography>
      )}

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <MenuItem
              {...item}
              onEdit={isAdmin ? handleEditItem : undefined}
              onDelete={isAdmin ? handleDeleteItem : undefined}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <MenuItemFormDialog
            open={isAddDialogOpen}
            onSave={handleAddItem}
            onClose={() => setIsAddDialogOpen(false)}
            defaultCategories={defaultCategories.filter(cat => cat !== 'All')}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MenuList; 
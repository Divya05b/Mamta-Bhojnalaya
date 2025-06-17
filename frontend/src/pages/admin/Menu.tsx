import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import { menuService } from '../../services/api';

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

interface FormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image: string;
}

const defaultFoodImage = '/images/default-food.jpg';

const AdminMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
    image: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await menuService.getMenuItems();
      setMenuItems(response.data);
    } catch (err) {
      setError('Failed to load menu items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const response = await menuService.uploadImage(file);
      setFormData(prev => ({ ...prev, image: response.data.image }));
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Safely get 'checked' only if the input type is a checkbox, otherwise use 'value'
    const fieldValue = type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;

    setFormData(prev => ({
      ...prev,
      [name || '']: fieldValue,
    }));
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        isAvailable: item.isAvailable,
        image: item.image || '',
      });
      setIsEditing(true);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        isAvailable: true,
        image: '',
      });
      setIsEditing(false);
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      isAvailable: true,
      image: '',
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditing && formData.id) {
        await menuService.updateMenuItem(formData.id, formData);
      } else {
        await menuService.createMenuItem(formData);
      }
      handleCloseModal();
      await fetchMenuItems();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} menu item. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;

    try {
      await menuService.deleteMenuItem(itemToDelete);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      await fetchMenuItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete menu item. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const categories = ['Breakfast', 'Thali', 'Main Course', 'Breads', 'Desserts', 'Beverages'];

  if (loading && menuItems.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Menu Management
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
          Add New Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {menuItems.length === 0 && !loading ? (
        <Alert severity="info">No menu items found. Add some new items to get started!</Alert>
      ) : (
        <Grid container spacing={4}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image || defaultFoodImage}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" fontWeight={700} gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      ₹{item.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color={item.isAvailable ? 'success.main' : 'error.main'}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Category: {item.category}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, borderTop: '1px solid #eee' }}>
                  <IconButton color="info" onClick={() => handleOpenModal(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="dense"
            name="name"
            label="Item Name"
            type="text"
            fullWidth
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
            label="Price (₹)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleChange}
            inputProps={{ step: "0.01" }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MuiMenuItem key={category} value={category}>
                  {category}
                </MuiMenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isAvailable}
                onChange={handleChange}
                name="isAvailable"
                color="primary"
              />
            }
            label="Available"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              disabled={uploadingImage}
            >
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
              <input type="file" hidden onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
            </Button>
            {formData.image && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {formData.image.split('/').pop()} (Uploaded)
              </Typography>
            )}
          </Box>
          {formData.image && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img src={formData.image} alt="Menu Item Preview" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this menu item? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMenu; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Switch,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  isAvailable: boolean;
  isSignatureDish?: boolean;
}

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    isSignatureDish: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useAuth();
  const [sortColumn, setSortColumn] = useState<'name' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchMenuItems();
  }, [sortColumn, sortDirection]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/menu', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let data: MenuItem[] = await response.json();

      if (sortColumn) {
        data = data.sort((a, b) => {
          if (sortColumn === 'name') {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
            if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
          }
          return 0;
        });
      }

      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleOpen = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        isAvailable: item.isAvailable,
        isSignatureDish: item.isSignatureDish ?? false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true,
        isSignatureDish: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isAvailable: true,
      isSignatureDish: false,
    });
    setImageFile(null);
  };

  const handleSort = (column: 'name') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('is_available', formData.isAvailable.toString());
    formDataToSend.append('is_signature_dish', formData.isSignatureDish.toString());
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const url = editingItem
        ? `http://localhost:5000/api/admin/menu/${editingItem.id}`
        : 'http://localhost:5000/api/admin/menu';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        fetchMenuItems();
        handleClose();
      } else {
        const errorData = await response.json();
        console.error('Error saving menu item:', errorData);
        alert(`Error: ${errorData.error || 'Failed to save menu item'}`);
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/menu/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          fetchMenuItems();
        } else {
          const errorData = await response.json();
          console.error('Error deleting menu item:', errorData);
          alert(`Error: ${errorData.error || 'Failed to delete menu item'}`);
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert(`Error: ${(error as Error).message}`);
      }
    }
  };

  const handleToggleAvailability = async (id: number, isAvailable: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/menu/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isAvailable }),
      });

      if (response.ok) {
        fetchMenuItems();
      } else {
        const errorData = await response.json();
        console.error('Error toggling menu item availability:', errorData);
        alert(`Error: ${errorData.error || 'Failed to toggle menu item availability'}`);
      }
    } catch (error) {
      console.error('Error toggling menu item availability:', error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Menu Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {sortColumn === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Signature Dish</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.isAvailable}
                    onChange={() => handleToggleAvailability(item.id, !item.isAvailable)}
                    color="primary"
                    name="isAvailable"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.isSignatureDish || false}
                    onChange={async (e) => {
                      const newSignatureStatus = e.target.checked;

                      // Optimistic update
                      const updatedItems = menuItems.map(menuItem =>
                        menuItem.id === item.id ? { ...menuItem, isSignatureDish: newSignatureStatus } : menuItem
                      );
                      setMenuItems(updatedItems);

                      try {
                        const formDataToSend = new FormData();
                        formDataToSend.append('name', item.name);
                        formDataToSend.append('description', item.description);
                        formDataToSend.append('price', item.price.toString());
                        formDataToSend.append('category', item.category);
                        formDataToSend.append('is_available', item.isAvailable.toString());
                        formDataToSend.append('is_signature_dish', newSignatureStatus.toString());
                        if (item.image_url) {
                          // If an image URL exists, it means no new file is being uploaded, but we need to send the existing URL
                          // If you allow changing image, you'd need a more complex handling for file input.
                          formDataToSend.append('image', item.image_url);
                        }

                        const response = await fetch(`http://localhost:5000/api/admin/menu/${item.id}`, {
                          method: 'PUT',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          },
                          body: formDataToSend,
                        });
                        if (!response.ok) {
                          throw new Error('Failed to update signature dish status');
                        }
                        // No need to re-fetch all items if optimistic update is reliable and backend sends full updated item
                        // However, fetchMenuItems() is safer to ensure consistency with backend's full state.
                        fetchMenuItems();
                      } catch (error) {
                        console.error('Error toggling signature dish status:', error);
                        alert(`Error: ${(error as Error).message}`);
                        fetchMenuItems(); // Revert on error by re-fetching
                      }
                    }}
                    color="secondary"
                    name="isSignatureDish"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <MenuItem value="appetizers">Appetizers</MenuItem>
                <MenuItem value="main_course">Main Course</MenuItem>
                <MenuItem value="desserts">Desserts</MenuItem>
                <MenuItem value="beverages">Beverages</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="file"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setImageFile(target.files?.[0] || null);
              }}
              margin="normal"
              inputProps={{ accept: 'image/*' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MenuManagement; 
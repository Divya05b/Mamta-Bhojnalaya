import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

interface MenuSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  isVegetarian: boolean;
  onVegetarianChange: (isVegetarian: boolean) => void;
  isSpicy: boolean;
  onSpicyChange: (isSpicy: boolean) => void;
  onClearFilters: () => void;
}

const MenuSearchFilter: React.FC<MenuSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  priceRange,
  onPriceRangeChange,
  isVegetarian,
  onVegetarianChange,
  isSpicy,
  onSpicyChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const handleClearFilters = () => {
    onClearFilters();
    setShowFilters(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: searchQuery && (
              <IconButton size="small" onClick={() => onSearchChange('')}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#fff',
            },
          }}
        />
        <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              bgcolor: showFilters ? '#ff5757' : '#fff',
              color: showFilters ? '#fff' : '#ff5757',
              '&:hover': {
                bgcolor: showFilters ? '#e04a4a' : '#f5f5f5',
              },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {showFilters && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={`${priceRange[0]}-${priceRange[1]}`}
                label="Price Range"
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  onPriceRangeChange([min, max]);
                }}
              >
                <MenuItem value="0-100">Under ₹100</MenuItem>
                <MenuItem value="100-200">₹100 - ₹200</MenuItem>
                <MenuItem value="200-500">₹200 - ₹500</MenuItem>
                <MenuItem value="500-1000">₹500 - ₹1000</MenuItem>
                <MenuItem value="1000-9999">Above ₹1000</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="Vegetarian"
                onClick={() => onVegetarianChange(!isVegetarian)}
                color={isVegetarian ? 'primary' : 'default'}
                sx={{
                  bgcolor: isVegetarian ? '#ff5757' : '#f5f5f5',
                  color: isVegetarian ? '#fff' : '#000',
                  '&:hover': {
                    bgcolor: isVegetarian ? '#e04a4a' : '#e0e0e0',
                  },
                }}
              />
              <Chip
                label="Spicy"
                onClick={() => onSpicyChange(!isSpicy)}
                color={isSpicy ? 'primary' : 'default'}
                sx={{
                  bgcolor: isSpicy ? '#ff5757' : '#f5f5f5',
                  color: isSpicy ? '#fff' : '#000',
                  '&:hover': {
                    bgcolor: isSpicy ? '#e04a4a' : '#e0e0e0',
                  },
                }}
              />
            </Box>

            <IconButton
              onClick={handleClearFilters}
              sx={{
                color: '#ff5757',
                '&:hover': { color: '#e04a4a' },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default MenuSearchFilter; 
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  InputAdornment,
  Rating,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
} from '@mui/icons-material';
import { fertilizerProducts, categories } from '../data/products';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { addToCart } = useCart();

  const filteredProducts = fertilizerProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: `${product.name} added to cart!`,
    });
  };

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 6,
          mb: 4,
        }}
      >
        <Container>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            🌾 Quality Fertilizers
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Find the perfect fertilizer for your crops
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search fertilizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
            }}
          />
        </Box>

        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.icon} ${category.name}`}
              onClick={() => setSelectedCategory(category.id)}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              sx={{
                fontSize: '1rem',
                py: 2.5,
                px: 1,
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s',
                },
              }}
            />
          ))}
        </Box>

        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
          {filteredProducts.length} Products Found
        </Typography>

        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip
                    label={product.category}
                    size="small"
                    color="secondary"
                    sx={{ mb: 1 }}
                  />
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Rating value={product.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({product.rating})
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Package: {product.unit}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      variant="h5"
                      color="primary.main"
                      sx={{ fontWeight: 700 }}
                    >
                      ₹{product.price}
                    </Typography>
                    <Chip
                      label={`${product.stock} in stock`}
                      size="small"
                      color={product.stock > 20 ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    size="large"
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Products;

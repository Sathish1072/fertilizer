import React, { useState, useEffect } from 'react';
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
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  FilterList,
  InfoOutlined,
  CheckCircle,
} from '@mui/icons-material';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';
import Layout from '../components/Layout';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [detailProduct, setDetailProduct] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (sortBy !== 'default') params.sort = sortBy;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await productsAPI.getAll(params);
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('Failed to load products from API, using fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      loadProducts();
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: `🌱 ${product.name} added to cart!`,
    });
  };

  // Filter products on client side for instantaneous typing feel
  const displayedProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q) ||
      product.npk?.toLowerCase().includes(q)
    );
  });

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 5,
          mb: 4,
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
        }}
      >
        <Container>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            🌾 Quality Agricultural Fertilizers
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 700 }}>
            Certified fertilizers directly sourced for optimal soil nutrition, root development, and bumper crop yields.
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        {/* Search & Sort Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by fertilizer name, NPK formula, or crop type (Press Enter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <Button size="small" onClick={loadProducts}>Search</Button>
                ),
              }}
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            >
              <MenuItem value="default">Featured / Recommended</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="name">Product Name (A-Z)</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Category Pills */}
        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.icon} ${category.name}`}
              onClick={() => setSelectedCategory(category.id)}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              sx={{
                fontSize: '0.95rem',
                py: 2.2,
                px: 1,
                cursor: 'pointer',
                fontWeight: selectedCategory === category.id ? 700 : 500,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s',
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {displayedProducts.length} Fertilizers Available
          </Typography>
          <Button
            size="small"
            startIcon={<FilterList />}
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSortBy('default');
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {displayedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id || product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="210"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Chip
                      label={product.category}
                      size="small"
                      color="secondary"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        fontWeight: 600,
                      }}
                    />
                    {product.npk && product.npk !== 'N/A' && (
                      <Chip
                        label={`NPK: ${product.npk}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(0,0,0,0.75)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 700, fontSize: '1.1rem', minHeight: 48 }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={product.rating || 4.5} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({product.rating || 4.5})
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      📦 <strong>Package:</strong> {product.unit || '50 kg Bag'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                        ₹{product.price}
                      </Typography>
                      <Chip
                        label={`${product.stock || 20} in stock`}
                        size="small"
                        color={(product.stock || 20) > 15 ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      size="medium"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setDetailProduct(product)}
                      sx={{ minWidth: 44, px: 1 }}
                      title="Quick Specs"
                    >
                      <InfoOutlined />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && displayedProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No fertilizers found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Try adjusting your search criteria or clearing filters.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                loadProducts();
              }}
            >
              Reset Filters
            </Button>
          </Box>
        )}
      </Container>

      {/* Product Detail Modal */}
      {detailProduct && (
        <Dialog open={Boolean(detailProduct)} onClose={() => setDetailProduct(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {detailProduct.name}
          </DialogTitle>
          <DialogContent dividers>
            <Box
              component="img"
              src={detailProduct.image}
              alt={detailProduct.name}
              sx={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 2, mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 2 }}>
              {detailProduct.description}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailProduct.category}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">NPK Ratio</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailProduct.npk || 'Standard Formula'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Composition</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailProduct.composition || '100% Guaranteed High-Grade'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Manufacturer</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailProduct.manufacturer || 'AgroGrow Industries'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Recommended For Crops</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {(detailProduct.suitableCrops || ['Paddy', 'Wheat', 'Vegetables', 'Cotton']).map((crop, i) => (
                    <Chip key={i} size="small" label={crop} variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailProduct(null)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => {
                handleAddToCart(detailProduct);
                setDetailProduct(null);
              }}
            >
              Add to Cart - ₹{detailProduct.price}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar Notification */}
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

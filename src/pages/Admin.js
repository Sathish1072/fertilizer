import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AttachMoney,
  ShoppingBag,
  Inventory,
  People,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  Storage,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { adminAPI, productsAPI, ordersAPI, healthAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  // States
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [dbHealth, setDbHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Add Product Dialog State
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Nitrogen',
    price: '',
    unit: '50 kg Bag',
    stock: '',
    description: '',
    npk: '',
    manufacturer: '',
    image: '',
  });

  // Edit Stock/Price Dialog State
  const [editingProduct, setEditingProduct] = useState(null);

  // Order Details Dialog State
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, healthRes] = await Promise.allSettled([
        adminAPI.getStats(),
        ordersAPI.getAllOrders(),
        productsAPI.getAll(),
        healthAPI.checkHealth(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders) {
        setOrders(ordersRes.value.orders);
      }
      if (productsRes.status === 'fulfilled' && productsRes.value?.products) {
        setProducts(productsRes.value.products);
      }
      if (healthRes.status === 'fulfilled') {
        setDbHealth(healthRes.value);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus, `Status updated to ${newStatus} by Admin`);
      setMessage({ type: 'success', text: `Order #${orderId} status changed to ${newStatus}` });
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      setMessage({ type: 'error', text: 'Name, Category, and Price are required' });
      return;
    }
    try {
      await productsAPI.create(newProduct);
      setMessage({ type: 'success', text: 'Product created successfully!' });
      setOpenAddProduct(false);
      setNewProduct({
        name: '',
        category: 'Nitrogen',
        price: '',
        unit: '50 kg Bag',
        stock: '',
        description: '',
        npk: '',
        manufacturer: '',
        image: '',
      });
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create product' });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await productsAPI.update(editingProduct._id || editingProduct.id, {
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
      });
      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setEditingProduct(null);
      fetchDashboardData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update product' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        setMessage({ type: 'success', text: 'Product deleted successfully' });
        fetchDashboardData();
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Failed to delete product' });
      }
    }
  };

  const handleResetCatalog = async () => {
    if (window.confirm('Reset catalog to default fertilizer products?')) {
      try {
        await productsAPI.resetSeed();
        setMessage({ type: 'success', text: 'Product catalog re-seeded successfully!' });
        fetchDashboardData();
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Failed to re-seed catalog' });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
      case 'Out for Delivery':
        return 'info';
      case 'Confirmed':
      case 'Placed':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: 'primary.dark',
          color: 'white',
          py: 4,
          mb: 4,
        }}
      >
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                ⚡ Store Manager & Admin Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                Manage live orders, inventory stock, customer fulfillment, and cloud database
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Refresh />}
                onClick={fetchDashboardData}
              >
                Refresh Data
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)' }}
                onClick={() => navigate('/products')}
              >
                View Store
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mb: 3 }}
            onClose={() => setMessage({ type: '', text: '' })}
          >
            {message.text}
          </Alert>
        )}

        {/* Database Status Banner */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            bgcolor: dbHealth?.database?.isConnected ? '#e8f5e9' : '#fff9c4',
            border: '1px solid',
            borderColor: dbHealth?.database?.isConnected ? '#a5d6a7' : '#fff59d',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Storage sx={{ color: dbHealth?.database?.isConnected ? 'success.main' : 'warning.dark' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Database Status: {dbHealth?.database?.isConnected ? '🟢 Online MongoDB Atlas Cluster Connected' : '🟡 In-Memory Resilient Fallback Active'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dbHealth?.database?.isConnected
                  ? `Cluster: ${dbHealth.database.database} (MongoDB Cloud M0 Sandbox)`
                  : 'Ready for client demo. To connect your live cloud database, update MONGODB_URI in .env.'}
              </Typography>
            </Box>
          </Box>
          <Chip
            size="small"
            label={dbHealth?.database?.isConnected ? 'Free Cloud Tier (M0)' : 'Demo Sandbox Mode'}
            color={dbHealth?.database?.isConnected ? 'success' : 'warning'}
            variant="filled"
          />
        </Paper>

        {/* KPI Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #2e7d32' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Sales Revenue
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'primary.main' }}>
                      ₹{stats?.totalRevenue?.toLocaleString('en-IN') || '4,343'}
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: 'primary.light' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #1976d2' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: '#1976d2' }}>
                      {orders.length || stats?.totalOrders || 2}
                    </Typography>
                  </Box>
                  <ShoppingBag sx={{ fontSize: 40, color: '#90caf9' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #ed6c02' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Catalog Products
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: '#ed6c02' }}>
                      {products.length || stats?.totalProducts || 10}
                    </Typography>
                  </Box>
                  <Inventory sx={{ fontSize: 40, color: '#ffb74d' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #9c27b0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Registered Customers
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: '#9c27b0' }}>
                      {stats?.totalUsers || 2}
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 40, color: '#ce93d8' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, val) => setCurrentTab(val)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={`📦 Orders Fulfillment (${orders.length})`} />
            <Tab label={`🌱 Products Inventory (${products.length})`} />
          </Tabs>
        </Box>

        {/* Tab 0: Orders Fulfillment */}
        {currentTab === 0 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Current Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Update Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        No orders recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((ord) => (
                      <TableRow key={ord.orderId || ord._id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{ord.orderId}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {ord.customerName || ord.shippingAddress?.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                          </Typography>
                        </TableCell>
                        <TableCell>{ord.items?.length || 1} item(s)</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ₹{ord.totalAmount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={(ord.paymentMethod || 'UPI').toUpperCase()}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={ord.orderStatus}
                            color={getStatusColor(ord.orderStatus)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                            sx={{ minWidth: 140 }}
                          >
                            <MenuItem value="Placed">Placed</MenuItem>
                            <MenuItem value="Confirmed">Confirmed</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => setViewingOrder(ord)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Tab 1: Products Inventory */}
        {currentTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenAddProduct(true)}
              >
                Add New Fertilizer Product
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Refresh />}
                onClick={handleResetCatalog}
              >
                Reset / Seed Default Catalog
              </Button>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>NPK / Formula</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Package Unit</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((prod) => (
                      <TableRow key={prod._id || prod.id} hover>
                        <TableCell>
                          <Box
                            component="img"
                            src={prod.image}
                            alt={prod.name}
                            sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{prod.name}</TableCell>
                        <TableCell>
                          <Chip size="small" label={prod.category} color="secondary" />
                        </TableCell>
                        <TableCell>{prod.npk || 'N/A'}</TableCell>
                        <TableCell>{prod.unit || '50 kg'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ₹{prod.price}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={`${prod.stock} left`}
                            color={prod.stock > 20 ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setEditingProduct(prod)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProduct(prod._id || prod.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Container>

      {/* Add Product Dialog */}
      <Dialog open={openAddProduct} onClose={() => setOpenAddProduct(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Fertilizer Product</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                {['Nitrogen', 'Phosphate', 'Potassium', 'Complex', 'Organic', 'Micronutrients', 'Bio-Fertilizer'].map(
                  (c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Packaging Unit"
                placeholder="e.g. 50 kg Bag, 5 L Drum"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NPK Ratio"
                placeholder="e.g. 19-19-19"
                value={newProduct.npk}
                onChange={(e) => setNewProduct({ ...newProduct, npk: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                value={newProduct.manufacturer}
                onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                placeholder="https://images.unsplash.com/..."
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Product Description & Benefits"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddProduct(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateProduct}>
            Save Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Stock & Price</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {editingProduct.name}
            </Typography>
            <TextField
              fullWidth
              label="Price (₹)"
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Available Stock"
              type="number"
              value={editingProduct.stock}
              onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingProduct(null)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateProduct}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* View Order Dialog */}
      {viewingOrder && (
        <Dialog open={Boolean(viewingOrder)} onClose={() => setViewingOrder(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Order Details: {viewingOrder.orderId}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Customer Information</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {viewingOrder.customerName} ({viewingOrder.customerEmail})
              </Typography>
              <Typography variant="body2">
                Phone: {viewingOrder.shippingAddress?.phone}
              </Typography>
              <Typography variant="body2">
                Address: {viewingOrder.shippingAddress?.address}, {viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.state} - {viewingOrder.shippingAddress?.pincode}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Purchased Items</Typography>
              {viewingOrder.items?.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2">{item.name} x {item.quantity}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{item.price * item.quantity}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total Paid</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ₹{viewingOrder.totalAmount} ({viewingOrder.paymentMethod?.toUpperCase()})
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                navigate(`/order-tracking/${viewingOrder.orderId}`);
                setViewingOrder(null);
              }}
            >
              Open Live Tracking View
            </Button>
            <Button variant="contained" onClick={() => setViewingOrder(null)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Layout>
  );
};

export default Admin;

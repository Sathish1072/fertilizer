import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ShoppingBag, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getMyOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
          bgcolor: 'primary.main',
          color: 'white',
          py: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
        }}
      >
        <Container>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            📦 My Fertilizer Orders
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
            Live status tracking and dispatch history for your farm supplies
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : orders.length > 0 ? (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.orderId || order._id}>
                <Card sx={{ borderRadius: 2, transition: 'all 0.2s', '&:hover': { boxShadow: 4 } }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Typography variant="caption" color="text.secondary">
                          Order Number
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {order.orderId}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          Booking Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          Items & Quantity
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.items?.length || 1} product(s)
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 800 }}>
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={1.5}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Status
                        </Typography>
                        <Chip
                          label={order.orderStatus}
                          color={getStatusColor(order.orderStatus)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={1.5} sx={{ textAlign: { sm: 'right' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForward />}
                          onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                        >
                          Track
                        </Button>
                      </Grid>
                    </Grid>

                    {/* Quick items list */}
                    {order.items && order.items.length > 0 && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {order.items.map((item, idx) => (
                            <Chip
                              key={idx}
                              size="small"
                              variant="outlined"
                              label={`${item.name} (x${item.quantity})`}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No orders found yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Browse our catalog of fertilizers and place your first order today!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
            >
              Explore Fertilizers
            </Button>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Orders;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Inventory,
  Home as HomeIcon,
  Receipt,
  ArrowBack,
  Store,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ordersAPI } from '../services/api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getById(orderId);
      if (res && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.warn('Could not fetch order from API, using demo details:', err);
      // Fallback demo order
      setOrder({
        orderId: orderId,
        orderStatus: 'Placed',
        customerName: 'Valued Farmer',
        shippingAddress: {
          fullName: 'Farmer Ramesh',
          phone: '9845098450',
          address: 'Plot 45, Green Valley Farm Road',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001',
        },
        paymentMethod: 'UPI',
        totalAmount: 2249,
        items: [
          { name: 'Neem Coated Urea (46% N)', price: 899, quantity: 2, unit: '50 kg Bag' },
        ],
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 3600 * 1000),
      });
    } finally {
      setLoading(false);
    }
  };

  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Shipped':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const steps = [
    {
      label: 'Order Placed & Payment Verified',
      description: 'Your fertilizer purchase has been received and verified by our logistics dispatch desk.',
      icon: <CheckCircle color="success" />,
    },
    {
      label: 'Confirmed & Warehouse Allocation',
      description: 'Bags and packaging units are quality-inspected and packed at the regional agricultural depot.',
      icon: <Inventory color="primary" />,
    },
    {
      label: 'Dispatched & On Highway Transit',
      description: 'Consignment is in transit with AgriExpress Heavy Haulage freight network.',
      icon: <LocalShipping color="info" />,
    },
    {
      label: 'Out for Local Delivery to Farm',
      description: 'Local delivery truck has departed from district hub towards your specified farm address.',
      icon: <LocalShipping color="warning" />,
    },
    {
      label: 'Delivered at Farm Gate',
      description: 'Fertilizers successfully handed over and receipt acknowledged.',
      icon: <HomeIcon color="success" />,
    },
  ];

  const activeStep = getActiveStepIndex(order?.orderStatus || 'Placed');

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Banner */}
      <Box
        sx={{
          bgcolor: order?.orderStatus === 'Delivered' ? 'success.main' : 'primary.main',
          color: 'white',
          py: 5,
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
        }}
      >
        <Container>
          <CheckCircle sx={{ fontSize: 60, mb: 1.5 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            {order?.orderStatus === 'Delivered' ? 'Order Delivered Successfully! 🌾' : 'Order Confirmed & In Progress! 📦'}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Tracking ID: <strong>{order?.orderId}</strong>
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Chip
              label={`Current Status: ${order?.orderStatus || 'Placed'}`}
              sx={{ bgcolor: 'white', color: 'primary.dark', fontWeight: 700, fontSize: '0.95rem' }}
            />
            <Chip
              label={`Estimated Arrival: ${new Date(order?.estimatedDelivery || Date.now() + 3 * 86400000).toLocaleDateString('en-IN')}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
          </Box>
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          {/* Tracking Stepper */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                🚚 Live Consignment Timeline
              </Typography>

              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label} active={index <= activeStep} completed={index < activeStep}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                          {index <= activeStep ? step.icon : <CheckCircle color="disabled" />}
                        </Box>
                      )}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: index === activeStep ? 700 : 500 }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/orders')}
                >
                  View All Orders
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Receipt />}
                  onClick={handlePrintInvoice}
                >
                  Download / Print Tax Invoice
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Order Details & Delivery Information */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                📍 Farm Shipping Details
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {order?.shippingAddress?.fullName || order?.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📞 {order?.shippingAddress?.phone}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {order?.shippingAddress?.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}
              </Typography>
              {order?.shippingAddress?.notes && (
                <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Special Delivery Instructions:
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.notes}
                  </Typography>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                📋 Items & Payment Summary
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              {order?.items?.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quantity: {item.quantity} × ₹{item.price} ({item.unit || 'Bag'})
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 1 }}>
                <Typography variant="body2">Payment Method</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  {order?.paymentMethod || 'UPI'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Payment Status</Typography>
                <Chip
                  size="small"
                  label={order?.paymentStatus || 'Completed'}
                  color="success"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Total Paid
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                  ₹{order?.totalAmount?.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default OrderTracking;

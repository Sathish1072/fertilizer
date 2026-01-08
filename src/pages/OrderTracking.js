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
} from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Inventory,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Simulate order status progression
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 3000); // Progress every 3 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      label: 'Order Placed',
      description: 'Your order has been confirmed and is being processed',
      icon: <CheckCircle />,
      date: new Date().toLocaleDateString(),
    },
    {
      label: 'Shipped',
      description: 'Your order has been dispatched from our warehouse',
      icon: <Inventory />,
      date: new Date(Date.now() + 86400000).toLocaleDateString(),
    },
    {
      label: 'Out for Delivery',
      description: 'Your order is on its way and will be delivered soon',
      icon: <LocalShipping />,
      date: new Date(Date.now() + 172800000).toLocaleDateString(),
    },
    {
      label: 'Delivered',
      description: 'Your order has been successfully delivered',
      icon: <HomeIcon />,
      date: new Date(Date.now() + 259200000).toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: 'success.main',
          color: 'white',
          py: 6,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Container>
          <CheckCircle sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Order Confirmed! 🎉
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Thank you for your purchase
          </Typography>
          <Chip
            label={`Order ID: ${orderId}`}
            sx={{
              mt: 2,
              bgcolor: 'white',
              color: 'success.main',
              fontWeight: 600,
              fontSize: '1rem',
              py: 2.5,
            }}
          />
        </Container>
      </Box>

      <Container sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Order Status
              </Typography>

              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor:
                              index <= activeStep ? 'primary.main' : 'grey.300',
                            color: 'white',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {step.icon}
                        </Box>
                      )}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {step.label}
                      </Typography>
                      {index <= activeStep && (
                        <Typography variant="body2" color="text.secondary">
                          {step.date}
                        </Typography>
                      )}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      {index === activeStep && index < steps.length - 1 && (
                        <Chip
                          label="In Progress"
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      {index === activeStep && index === steps.length - 1 && (
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {activeStep === steps.length - 1 && (
                <Box sx={{ mt: 4, p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    ✅ Delivered Successfully!
                  </Typography>
                  <Typography variant="body2">
                    We hope you're satisfied with your purchase. Happy farming! 🌾
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Delivery Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Estimated Delivery
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    {new Date(Date.now() + 259200000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Shipping Method
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    Standard Delivery (FREE)
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tracking Support
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Available 24/7
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/products')}
                sx={{ mb: 2 }}
              >
                Continue Shopping
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/orders')}
              >
                View All Orders
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default OrderTracking;

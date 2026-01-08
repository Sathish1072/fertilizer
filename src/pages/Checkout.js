import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  CheckCircle,
  CreditCard,
  AccountBalance,
  Money,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');

  const steps = ['Shipping Address', 'Payment Method', 'Review & Confirm'];

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(shippingInfo.phone))
      newErrors.phone = 'Invalid phone number';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(shippingInfo.pincode))
      newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShipping()) {
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = () => {
    const orderId = `ORD${Date.now()}`;
    clearCart();
    navigate(`/order-tracking/${orderId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <Container sx={{ py: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Shipping Address
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleChange}
                        error={!!errors.state}
                        helperText={errors.state}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handleChange}
                        error={!!errors.pincode}
                        helperText={errors.pincode}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Payment Method
                  </Typography>
                  <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <Card
                        sx={{
                          mb: 2,
                          border: '2px solid',
                          borderColor:
                            paymentMethod === 'upi' ? 'primary.main' : 'grey.300',
                        }}
                      >
                        <CardContent>
                          <FormControlLabel
                            value="upi"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountBalance sx={{ mr: 1 }} />
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    UPI Payment
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Pay using Google Pay, PhonePe, Paytm, etc.
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>

                      <Card
                        sx={{
                          mb: 2,
                          border: '2px solid',
                          borderColor:
                            paymentMethod === 'card' ? 'primary.main' : 'grey.300',
                        }}
                      >
                        <CardContent>
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CreditCard sx={{ mr: 1 }} />
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Credit / Debit Card
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Pay using Visa, Mastercard, RuPay
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>

                      <Card
                        sx={{
                          border: '2px solid',
                          borderColor:
                            paymentMethod === 'cod' ? 'primary.main' : 'grey.300',
                        }}
                      >
                        <CardContent>
                          <FormControlLabel
                            value="cod"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Money sx={{ mr: 1 }} />
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Cash on Delivery
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Pay when you receive the order
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Review Your Order
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2">{shippingInfo.fullName}</Typography>
                    <Typography variant="body2">{shippingInfo.phone}</Typography>
                    <Typography variant="body2">{shippingInfo.address}</Typography>
                    <Typography variant="body2">
                      {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Payment Method
                    </Typography>
                    <Typography variant="body2">
                      {paymentMethod === 'upi' && '💳 UPI Payment'}
                      {paymentMethod === 'card' && '💳 Credit/Debit Card'}
                      {paymentMethod === 'cod' && '💵 Cash on Delivery'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Order Items
                    </Typography>
                    {cartItems.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {item.name} × {item.quantity}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handlePlaceOrder}
                    size="large"
                  >
                    Place Order
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ₹{getCartTotal().toLocaleString()}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 600 }}>
                  FREE
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  ₹{getCartTotal().toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Checkout;

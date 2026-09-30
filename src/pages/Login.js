import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, Agriculture, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setLoginError('');
      const result = await login(formData.email, formData.password);
      setLoading(false);
      if (result.success) {
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/products');
        }
      } else {
        setLoginError(result.message || 'Invalid email or password');
      }
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setLoginError('');
    let email = '';
    let pass = '';

    if (role === 'admin') {
      email = 'admin@fertilizershop.com';
      pass = 'Admin@123';
    } else {
      email = 'farmer@demo.com';
      pass = 'Farmer@123';
    }

    setFormData({ email, password: pass });
    const result = await login(email, pass);
    setLoading(false);

    if (result.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'white',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 800, color: 'primary.main' }}
            >
              🌱 FertilizerShop
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to manage your orders & farm agricultural supplies
            </Typography>
          </Box>

          {/* Quick Demo Section for Client Evaluation */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#f1f8e9',
              borderColor: '#a5d6a7',
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark', display: 'block', mb: 1, textTransform: 'uppercase' }}>
              ⚡ 1-Click Evaluation Logins (Client / Reviewer)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                startIcon={<Agriculture />}
                onClick={() => handleQuickDemo('farmer')}
                disabled={loading}
              >
                Farmer Demo
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                startIcon={<AdminPanelSettings />}
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
              >
                Store Admin Demo
              </Button>
            </Box>
          </Paper>

          {loginError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{ fontWeight: 600 }}
                >
                  Create Farmer Account
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

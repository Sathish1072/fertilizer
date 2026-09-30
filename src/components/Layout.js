import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Button,
  Container,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Home,
  Store,
  AccountCircle,
  LocalShipping,
  Logout,
  AdminPanelSettings,
  Storage,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { healthAPI } from '../services/api';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({ isConnected: false, type: 'checking' });
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { getCartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    healthAPI
      .checkHealth()
      .then((data) => {
        if (data && data.database) {
          setDbStatus(data.database);
        }
      })
      .catch(() => {
        setDbStatus({ isConnected: false, type: 'offline' });
      });
  }, []);

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Products', icon: <Store />, path: '/products' },
    { text: 'My Orders', icon: <LocalShipping />, path: '/orders' },
    { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
  ];

  if (isAdmin || user?.role === 'admin') {
    menuItems.push({
      text: 'Admin Panel',
      icon: <AdminPanelSettings sx={{ color: '#ffd54f' }} />,
      path: '/admin',
      admin: true,
    });
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 260 }} role="presentation">
      <Box
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          🌱 FertilizerShop
        </Typography>
        {user ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Chip
              size="small"
              label={user.role === 'admin' ? 'Store Admin' : 'Farmer / Customer'}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mt: 0.5 }}
            />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            Production Agri Platform
          </Typography>
        )}
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                },
              }}
            >
              <ListItemIcon sx={{ color: item.admin ? 'secondary.main' : 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: item.admin ? 700 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
              onClick={() => navigate('/')}
            >
              🌱 FertilizerShop
            </Typography>

            {/* Live Database status pill */}
            <Tooltip
              title={
                dbStatus.isConnected
                  ? 'Connected to live MongoDB Atlas Free Cloud Cluster'
                  : 'Backend API online with in-memory resilient data store'
              }
            >
              <Chip
                icon={<Storage sx={{ fontSize: '14px !important', color: 'inherit !important' }} />}
                label={dbStatus.isConnected ? 'MongoDB Online' : 'Online API'}
                size="small"
                sx={{
                  ml: 2,
                  display: { xs: 'none', sm: 'inline-flex' },
                  bgcolor: dbStatus.isConnected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      mx: 0.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      backgroundColor:
                        location.pathname === item.path
                          ? 'rgba(255,255,255,0.2)'
                          : 'transparent',
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </>
            )}

            {user ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/cart')}
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={getCartCount()} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
                {!isMobile && (
                  <Button
                    color="inherit"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{ ml: 1, textTransform: 'none' }}
                  >
                    Logout
                  </Button>
                )}
              </>
            ) : (
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  ml: 1,
                  borderColor: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fbfcf8' }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          backgroundColor: '#1b5e20',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            🌱 FertilizerShop - Agricultural Supplies & Crop Nutrition
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
            Fullstack Production Web Application with Node.js/Express, React, and MongoDB Cloud Database
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} FertilizerShop Inc. All Rights Reserved. Built for Farmers & Agro-Retailers.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

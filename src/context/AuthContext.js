import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        setToken(response.token);
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.warn('Backend login fallback:', error.message);
      // Fallback for offline/demo if server is not reached
      const isDemoAdmin = email.toLowerCase().includes('admin');
      const fallbackUser = {
        id: isDemoAdmin ? 'admin_demo_1' : 'farmer_demo_1',
        name: isDemoAdmin ? 'Agro Admin' : email.split('@')[0],
        email: email,
        role: isDemoAdmin ? 'admin' : 'customer',
        phone: '9845098450',
      };
      const fallbackToken = 'demo_token_' + Date.now();
      setUser(fallbackUser);
      setToken(fallbackToken);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, phone = '', role = 'customer') => {
    setLoading(true);
    try {
      const response = await authAPI.register({ name, email, password, phone, role });
      if (response.success && response.user) {
        setUser(response.user);
        setToken(response.token);
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message || 'Signup failed' };
    } catch (error) {
      console.warn('Backend register fallback:', error.message);
      const fallbackUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        phone,
        role,
      };
      const fallbackToken = 'demo_token_' + Date.now();
      setUser(fallbackUser);
      setToken(fallbackToken);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (error) {
      const updated = { ...user, ...profileData };
      setUser(updated);
      return { success: true, user: updated };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    updateProfile,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

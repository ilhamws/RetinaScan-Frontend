import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found in localStorage');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Coba verifikasi token dengan endpoint yang benar
        // Coba API user/profile terlebih dahulu
        try {
          await axios.get(`${API_URL}/api/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Token verified via user/profile');
          setIsAuthenticated(true);
        } catch (profileError) {
          // Jika user/profile gagal, coba auth/verify
          console.log('Failed to verify via profile API, trying auth/verify');
          await axios.get(`${API_URL}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Token verified via auth/verify');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [API_URL]);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        flexDirection="column"
        minHeight="50vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary" mt={3}>
          Memverifikasi sesi...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 
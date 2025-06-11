import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const register = async (userData) => {
  try {
    console.log('Mengirim permintaan registrasi ke:', `${API_URL}/api/auth/register`);
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    console.log('Respons registrasi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registrasi error:', error.response || error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    console.log('Sending login request to:', `${API_URL}/api/auth/login`);
    console.log('With credentials:', { email: credentials.email, password: '***' });
    
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    console.log('Login API response status:', response.status);
    console.log('Login API response data:', response.data ? 'Data received' : 'No data');
    
    // Pastikan respons mengandung token
    if (!response.data) {
      throw new Error('Tidak ada data dalam respons server');
    }
    
    if (!response.data.token) {
      console.error('Token tidak ditemukan dalam respons:', response.data);
      throw new Error('Token tidak ditemukan dalam respons server');
    }
    
    // Verifikasi format token
    try {
      // Cek apakah token adalah string dan memiliki format yang valid
      if (typeof response.data.token !== 'string' || response.data.token.length < 10) {
        console.error('Format token tidak valid:', response.data.token);
        throw new Error('Format token tidak valid');
      }
      
      console.log('Token valid, returning response data');
      return response.data; // Mengembalikan { token, user }
    } catch (tokenError) {
      console.error('Token validation error:', tokenError);
      throw new Error('Format token tidak valid');
    }
  } catch (error) {
    console.error('Login API error:', error.response || error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (resetCode, password) => {
  const response = await axios.post(`${API_URL}/api/auth/reset-password`, { resetCode, password });
  return response.data;
};
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import App from './App.jsx';
import './index.css';

// Menggunakan HashRouter untuk mengatasi masalah routing static hosting
// HashRouter menambahkan # pada URL tapi menghindari masalah 404 saat refresh
// Contoh URL: https://retinascan.onrender.com/#/login 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
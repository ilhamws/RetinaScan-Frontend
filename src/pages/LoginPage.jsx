import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { login } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { handleFrontendLogout, getHashParams, cleanHashParams } from '../utils/authUtils';
import { HomeIcon, ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon, ExclamationCircleIcon, LockClosedIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import { withPageTransition } from '../context/ThemeContext';
import { ParallaxBanner, Parallax } from 'react-scroll-parallax';
import OptimizedBackgroundSwitch from '../components/animations/OptimizedBackgroundSwitch';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();
  const { theme, isMobile, isDarkMode } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          console.log('Checking existing token...');
          // Coba dengan endpoint profile terlebih dahulu
          try {
            await axios.get(`${API_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Token valid via profile endpoint');
            setIsAuthenticated(true);
          } catch (profileError) {
            console.log('Profile endpoint failed, trying verify endpoint');
            // Jika gagal, coba dengan endpoint verify
            try {
              await axios.get(`${API_URL}/api/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              console.log('Token valid via verify endpoint');
              setIsAuthenticated(true);
            } catch (verifyError) {
              console.error('All verification methods failed');
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }
          }
        } catch (error) {
          console.error('Token verification error:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        console.log('No token found in localStorage');
      }
    };
    
    // Periksa parameter URL untuk error login (dari hash karena HashRouter)
    const query = getHashParams();
    
    const authError = query.get('auth');
    const from = query.get('from');
    
    console.log('Hash params:', query.toString());
    console.log('Auth params:', { auth: authError, from });
    
    if (authError === 'failed' && from === 'dashboard') {
      console.log('Login error detected from URL parameters');
      setError('Sesi login gagal. Silakan login kembali.');
      
      // Hapus parameter dari URL (sesuai dengan HashRouter)
      cleanHashParams();
    }
    
    checkAuth();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      console.log('Mencoba login dengan:', { email, password: '***' });
      console.log('API URL:', API_URL);
      console.log('DASHBOARD URL:', DASHBOARD_URL);
      
      const response = await login({ email, password });
      console.log('Login response:', response);
      
      if (response && response.token) {
        // Simpan token ke localStorage
        localStorage.setItem('token', response.token);
        
        // Simpan informasi user jika ada
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        console.log('Login berhasil, redirect ke dashboard');
        
        // Pastikan DASHBOARD_URL tidak kosong
        const dashboardUrl = DASHBOARD_URL || 'http://localhost:3000';
        
        // Karena menggunakan HashRouter, kita perlu menyesuaikan URL redirect
        // Format yang benar: https://dashboard.example.com/#/?token=xxx
        console.log('Redirecting to:', `${dashboardUrl}/#/?token=${response.token}`);
        
        // Redirect ke dashboard dengan token sebagai parameter
        // Gunakan timeout untuk memastikan log selesai tercetak
        setTimeout(() => {
          window.location.href = `${dashboardUrl}/#/?token=${response.token}`;
        }, 500);
      } else {
        throw new Error('Token tidak ditemukan dalam respon');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email atau kata sandi salah. Silakan periksa kembali informasi login Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    handleFrontendLogout(setIsAuthenticated, null, null, navigate);
  };
  
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03, 
      boxShadow: isDarkMode 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
        : '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.15)'
    },
    tap: { scale: 0.97 },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 1
      }
    }
  };

  const floatingIconVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shapeVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 0.2, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02, 
      boxShadow: `0 0 0 3px ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`, 
      borderColor: '#3B82F6',
      transition: { duration: 0.3 } 
    },
    blur: { 
      scale: 1, 
      boxShadow: 'none', 
      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
      transition: { duration: 0.2 } 
    }
  };

  if (isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 py-20 pt-36 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
            isDarkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white/90 backdrop-blur-md border border-gray-100'
          }`}
        >
          <div className="text-center mb-6">
          <motion.div
              variants={floatingIconVariants}
              initial="initial"
              animate="animate"
              className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4"
            >
              <ArrowLeftOnRectangleIcon className="h-8 w-8" />
          </motion.div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Anda Sudah Login
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Silakan kembali ke beranda atau logout untuk masuk dengan akun lain.
            </p>
          </div>
          
          <div className="space-y-4">
            <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
              <Link
                to="/"
                className={`flex items-center justify-center w-full py-3 px-4 rounded-lg ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors duration-200`}
                >
                <HomeIcon className="h-5 w-5 mr-2" />
                Kembali ke Beranda
              </Link>
            </motion.div>
            
            <motion.button
              onClick={handleLogout}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              className={`flex items-center justify-center w-full py-3 px-4 rounded-lg ${
                  isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                  : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
              } transition-colors duration-200`}
                >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } relative overflow-hidden`}>
      {/* Background */}
      <OptimizedBackgroundSwitch
        mouseControls={true}
        touchControls={true}
        gyroControls={false}
        minHeight={window.innerHeight || 800}
        minWidth={window.innerWidth || 1200}
        scale={1.00}
        scaleMobile={1.00}
        backgroundColor={isDarkMode ? 0x000000 : 0xffffff}
        color1={isDarkMode ? 0x0077ff : 0x0077ff}
        color2={isDarkMode ? 0x4b0082 : 0x4169e1}
        colorMode="variance"
        birdSize={1.0}
        wingSpan={30.0}
        speedLimit={5.0}
        separation={100.0}
        alignment={20.0}
        cohesion={20.0}
        quantity={2.0}
        backgroundAlpha={0.0}
      />
      
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          className={`absolute top-[20%] left-[10%] w-64 h-64 rounded-full ${
            isDarkMode ? 'bg-blue-500/10' : 'bg-blue-300/20'
          } blur-3xl`}
        />
        <motion.div 
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className={`absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full ${
            isDarkMode ? 'bg-purple-500/10' : 'bg-purple-300/20'
          } blur-3xl`}
        />
      </div>

      <div className="flex flex-col items-center justify-center relative z-10 my-auto h-auto">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <Link to="/" className="inline-flex items-center justify-center">
              <EyeIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`ml-2 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                RetinaScan
              </span>
            </Link>
          </motion.div>

          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className={`px-10 py-8 rounded-2xl shadow-2xl max-h-fit ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-lg border border-gray-700' 
                : 'bg-white/90 backdrop-blur-lg border border-gray-100'
            }`}
          >
            <motion.h2 
              variants={itemVariants}
              className={`text-2xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Selamat Datang Kembali
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className={`text-center mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Masuk untuk melanjutkan ke RetinaScan
            </motion.p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg mb-6 flex items-center ${
                  isDarkMode 
                    ? 'bg-red-900/30 text-red-200 border border-red-800/30' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}
              >
                <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <motion.form onSubmit={handleSubmit} className="space-y-5" variants={formVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <AtSymbolIcon className="h-5 w-5" />
                  </div>
                  <motion.input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variants={inputVariants}
                    animate={focusedInput === 'email' ? 'focus' : 'blur'}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <LockClosedIcon className="h-5 w-5" />
                  </div>
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variants={inputVariants}
                    animate={focusedInput === 'password' ? 'focus' : 'blur'}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={`h-4 w-4 rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600' 
                        : 'bg-gray-100 border-gray-300 text-blue-600 focus:ring-blue-500'
                    }`}
                  />
                  <label htmlFor="remember-me" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Ingat saya
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className={`font-medium hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Lupa kata sandi?
                  </Link>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover={!isLoading ? "hover" : undefined}
                whileTap={!isLoading ? "tap" : undefined}
                animate={isLoading ? "loading" : "initial"}
                className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-white font-medium ${
                  isLoading 
                    ? isDarkMode ? 'bg-gray-600' : 'bg-blue-400'
                    : isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors duration-200`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <span className="flex items-center">
                    Masuk
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </span>
                )}
              </motion.button>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Belum punya akun?{' '}
                <Link to="/register" className={`font-medium hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Daftar sekarang
                </Link>
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Link to="/" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
              &larr; Kembali ke beranda
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default withPageTransition(LoginPage);
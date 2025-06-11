import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  processLogoutParams, 
  cleanupAfterLogout, 
  getLogoutMessage,
  handleFrontendLogout,
  getHashParams,
  cleanHashParams
} from '../../utils/authUtils';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  UserIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Komponen notifikasi untuk logout
const LogoutNotification = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}
    >
      <Icon className="h-5 w-5 mr-2" />
      {message}
      <button 
        onClick={onClose} 
        className="ml-4 hover:bg-white/20 rounded-full p-1"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

// Komponen tombol toggle tema yang lebih menarik
const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  const { animations } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
      }`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SunIcon className="h-6 w-6 text-yellow-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MoonIcon className="h-5 w-5 text-indigo-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, isMobile, isDarkMode, toggleTheme, animations } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  const checkAuth = async (forceLogout = false) => {
    if (forceLogout) {
      console.log('Forcing logout due to query parameter');
      cleanupAfterLogout();
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setIsAuthenticated(true);
        setUserName(response.data.name || 'User');
        setToken(storedToken);
      } catch (error) {
        console.error('Auth check failed:', error);
        cleanupAfterLogout();
        setIsAuthenticated(false);
        setUserName('');
        setToken('');
      }
    } else {
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
    }
  };

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    // Dengan HashRouter, kita perlu mengambil query parameter dari hash
    // Format URL: /#/?logout=true&from=dashboard
    const query = getHashParams();
    
    // Proses parameter logout menggunakan utility function
    const logoutParams = processLogoutParams(query);
    
    // Jika parameter logout=true, paksa logout
    if (logoutParams.isLogout) {
      // Bersihkan data setelah logout
      cleanupAfterLogout();
      
      // Reset state
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
      
      // Dapatkan pesan logout yang sesuai
      const message = getLogoutMessage(logoutParams);
      if (message) {
        setNotification({
          show: true,
          message,
          type: logoutParams.hasError ? 'error' : 'success'
        });
      }
      
      // Hapus parameter logout dari URL (sesuai dengan HashRouter)
      cleanHashParams();
    } else if (query.get('auth') === 'failed' && query.get('from') === 'dashboard') {
      // Hapus parameter dari URL (sesuai dengan HashRouter)
      cleanHashParams();
      
      // Tambahkan notifikasi error login
      const message = 'Sesi login Anda telah berakhir. Silakan login kembali.';
      setNotification({
        show: true,
        message,
        type: 'error'
      });
    } else {
      // Hanya periksa autentikasi jika tidak sedang logout
      checkAuth(false);
    }
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    handleFrontendLogout();
    setIsAuthenticated(false);
    setUserName('');
    setToken('');
    setIsOpen(false);
    navigate('/');
    
    setNotification({
      show: true,
      message: 'Anda berhasil logout',
      type: 'success'
    });
  };
  
  const navLinks = [
    { name: 'Beranda', path: '/', icon: <HomeIcon className="w-5 h-5 mr-2" /> }
  ];
  
  const authLinks = isAuthenticated
    ? [
        { name: userName, path: '#', icon: <UserIcon className="w-5 h-5 mr-2" /> },
        { name: 'Dashboard', path: DASHBOARD_URL, icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
        { name: 'Logout', action: handleLogout, icon: <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> }
      ]
    : [
        { name: 'Login', path: '/login', icon: <UserCircleIcon className="w-5 h-5 mr-2" /> },
        { name: 'Register', path: '/register', icon: <UserIcon className="w-5 h-5 mr-2" /> }
      ];

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    tap: { scale: 0.95 }
  };
  
  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      x: "100%",
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };
  
  const mobileItemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {notification.show && (
          <LogoutNotification 
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}
      </AnimatePresence>
      
      <motion.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDarkMode
              ? 'bg-gray-900/90 backdrop-blur-md shadow-lg shadow-gray-900/10'
              : 'bg-white/90 backdrop-blur-md shadow-lg shadow-black/5'
            : isDarkMode
              ? 'bg-transparent'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'none' }}
            >
              <Link 
                to="/" 
                className="flex items-center"
                style={{ 
                  background: 'none', 
                  transition: 'none'
                }}
              >
                <EyeIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span 
                  className={`ml-2 text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ 
                    background: 'transparent', 
                    position: 'relative', 
                    zIndex: 5,
                    transition: 'color 0.3s ease',
                    backdropFilter: 'none'
                  }}
                >
                  RetinaScan
                </span>
              </Link>
            </motion.div>

          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks
                .filter(link => (!link.requireAuth || (link.requireAuth && isAuthenticated)) && !(link.hideWhenAuth && isAuthenticated))
                .map((link) => (
                  <motion.div key={link.name} variants={linkVariants} whileHover="hover" whileTap="tap">
                <Link 
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                        location.pathname === link.path
                          ? isDarkMode
                            ? 'bg-gray-800 text-white'
                            : 'bg-blue-50 text-blue-700'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                      } transition-colors duration-200`}
                >
                      {link.icon}
                      {link.name}
                </Link>
              </motion.div>
            ))}
            
              {authLinks.map((link) => (
                <motion.div key={link.name} variants={linkVariants} whileHover="hover" whileTap="tap">
                  {link.path ? (
                      <Link 
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                        location.pathname === link.path
                          ? isDarkMode
                            ? 'bg-gray-800 text-white'
                            : 'bg-blue-50 text-blue-700'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                      } transition-colors duration-200`}
                      >
                      {link.icon}
                      {link.name}
                      </Link>
                  ) : (
                      <button
                      onClick={link.action}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      } transition-colors duration-200`}
                      >
                      {link.icon}
                      {link.name}
                      </button>
                  )}
                </motion.div>
              ))}
              
              {/* Theme Toggle */}
              <div className="ml-2">
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </div>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              
              <motion.button
                whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
                className={`ml-2 p-2 rounded-md ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                <span className="sr-only">Open main menu</span>
              {isOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className={`md:hidden ${
                isDarkMode 
                  ? 'bg-gray-900 shadow-lg shadow-gray-900/20' 
                  : 'bg-white shadow-lg shadow-black/5'
              }`}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks
                  .filter(link => (!link.requireAuth || (link.requireAuth && isAuthenticated)) && !(link.hideWhenAuth && isAuthenticated))
                  .map((link) => (
                    <motion.div key={link.name} variants={mobileItemVariants}>
                    <Link 
                        to={link.path}
                        className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                          location.pathname === link.path
                            ? isDarkMode
                              ? 'bg-gray-800 text-white'
                              : 'bg-blue-50 text-blue-700'
                            : isDarkMode
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                        } transition-colors duration-200`}
                      onClick={() => setIsOpen(false)}
                    >
                        {link.icon}
                        {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                {authLinks.map((link) => (
                  <motion.div key={link.name} variants={mobileItemVariants}>
                    {link.path ? (
                      <Link 
                        to={link.path}
                        className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                          location.pathname === link.path
                            ? isDarkMode
                              ? 'bg-gray-800 text-white'
                              : 'bg-blue-50 text-blue-700'
                            : isDarkMode
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                        } transition-colors duration-200`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          link.action();
                          setIsOpen(false);
                        }}
                        className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        } transition-colors duration-200`}
                      >
                        {link.icon}
                        {link.name}
                      </button>
                    )}
                    </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

export default Navbar;
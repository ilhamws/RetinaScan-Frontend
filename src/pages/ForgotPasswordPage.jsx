import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { withPageTransition } from '../context/ThemeContext';
import { ParallaxBanner, Parallax } from 'react-scroll-parallax';
import { AtSymbolIcon, KeyIcon, ArrowRightIcon, ExclamationCircleIcon, CheckCircleIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import OptimizedBackgroundSwitch from '../components/animations/OptimizedBackgroundSwitch';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Palet warna yang direkomendasikan
  const colors = {
    primary: isDarkMode ? '#4F46E5' : '#4338CA', // Indigo
    secondary: isDarkMode ? '#8B5CF6' : '#7C3AED', // Violet
    accent: isDarkMode ? '#EC4899' : '#DB2777', // Pink
    success: isDarkMode ? '#10B981' : '#059669', // Emerald
    warning: isDarkMode ? '#F59E0B' : '#D97706', // Amber
    error: isDarkMode ? '#EF4444' : '#DC2626', // Red
    background: isDarkMode ? '#1F2937' : '#F9FAFB', // Gray
    card: isDarkMode ? '#374151' : '#FFFFFF', // White/Dark Gray
    text: isDarkMode ? '#F9FAFB' : '#1F2937', // Gray
    textMuted: isDarkMode ? '#9CA3AF' : '#6B7280', // Gray
  };

  // Animation variants
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

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 300 
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03, 
      boxShadow: `0 10px 15px -3px rgba(${isDarkMode ? '0, 0, 0' : '79, 70, 229'}, 0.3), 0 4px 6px -2px rgba(${isDarkMode ? '0, 0, 0' : '79, 70, 229'}, 0.15)`,
      background: isDarkMode ? colors.secondary : colors.primary,
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

  const inputVariants = {
    focus: { 
      scale: 1.02, 
      boxShadow: `0 0 0 3px ${isDarkMode ? 'rgba(79, 70, 229, 0.3)' : 'rgba(79, 70, 229, 0.2)'}`, 
      borderColor: colors.primary,
      transition: { duration: 0.3 } 
    },
    blur: { 
      scale: 1, 
      boxShadow: 'none', 
      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
      transition: { duration: 0.2 } 
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

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: 'spring',
        damping: 10,
        stiffness: 200
      } 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setError('');
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setMessage('');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

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
            isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-300/20'
          } blur-3xl`}
        />
        <motion.div 
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className={`absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full ${
            isDarkMode ? 'bg-violet-500/10' : 'bg-violet-300/20'
          } blur-3xl`}
        />
        <motion.div 
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className={`absolute top-[40%] right-[20%] w-40 h-40 rounded-full ${
            isDarkMode ? 'bg-pink-500/10' : 'bg-pink-300/20'
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
              <KeyIcon className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
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
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <motion.div className="text-center mb-8">
                    <motion.h2 
                      variants={itemVariants}
                      className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Pulihkan Kata Sandi
                    </motion.h2>
                    
                    <motion.p
                      variants={itemVariants}
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Masukkan email Anda untuk mendapatkan kode verifikasi
                    </motion.p>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg mb-6 ${
                        isDarkMode 
                          ? 'bg-red-900/30 border border-red-800/30' 
                          : 'bg-red-50 border border-red-100'
                      }`}
                    >
                      <div className="flex items-start">
                        <ExclamationCircleIcon className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                          isDarkMode ? 'text-red-400' : 'text-red-500'
                        }`} />
                        <p className={`text-sm ${
                          isDarkMode ? 'text-red-300' : 'text-red-800'
                        }`}>
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <motion.form onSubmit={handleSubmit} variants={itemVariants}>
                    <div className="mb-6">
                      <motion.label 
                        htmlFor="email" 
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Email
                      </motion.label>
                      <div className="relative">
                        <motion.div 
                          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          <AtSymbolIcon className="h-5 w-5" />
                        </motion.div>
                        <motion.input
                          variants={inputVariants}
                          animate={focusedInput === 'email' ? 'focus' : 'blur'}
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput('email')}
                          onBlur={() => setFocusedInput(null)}
                          required
                          placeholder="nama@email.com"
                          className={`pl-10 w-full py-3 px-4 rounded-xl text-sm ${
                            isDarkMode 
                              ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
                              : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
                          } border focus:outline-none transition-all duration-200`}
                        />
                      </div>
                    </div>

                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      animate={isLoading ? 'loading' : 'initial'}
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-xl font-medium text-white flex items-center justify-center ${
                        isDarkMode 
                          ? 'bg-indigo-600 hover:bg-indigo-500' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      } transition-all duration-200 disabled:opacity-70`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Kode Verifikasi
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>

                  <motion.div 
                    variants={itemVariants}
                    className="mt-6 text-center"
                  >
                    <Link to="/login" className={`text-sm ${
                      isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                    } transition-colors duration-200`}>
                      Kembali ke Masuk
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <motion.div 
                    variants={iconVariants} 
                    className="flex justify-center mb-6"
                  >
                    <div className={`rounded-full p-3 ${
                      isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                    }`}>
                      <EnvelopeIcon className={`h-10 w-10 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                    </div>
                  </motion.div>
                  
                  <motion.h2 
                    variants={itemVariants}
                    className={`text-2xl font-bold mb-3 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Cek Email Anda
                  </motion.h2>
                  
                  <motion.p 
                    variants={itemVariants}
                    className={`mb-6 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Kami telah mengirim kode verifikasi ke alamat <span className="font-semibold">{email}</span>. Silakan cek kotak masuk dan folder spam email Anda untuk mendapatkan instruksi reset kata sandi.
                  </motion.p>

                  <motion.div variants={itemVariants} className="mt-4">
                    <Link to="/login" className={`text-sm ${
                      isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                    } transition-colors duration-200`}>
                      Kembali ke Masuk
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default withPageTransition(ForgotPasswordPage);
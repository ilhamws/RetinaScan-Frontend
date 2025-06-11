import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { newTheme, enhancedAnimations } from '../utils/newTheme';

// Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentThemeName, setCurrentThemeName] = useState(() => {
    return localStorage.getItem('themeName') || 'blue';
  });
  const [theme, setTheme] = useState(() => {
    // Menggunakan tema default dengan modifikasi sesuai tema yang dipilih dari localStorage
    const savedThemeName = localStorage.getItem('themeName') || 'blue';
    
    // Warna tema sesuai dengan yang tersedia di SettingsPage
    const themeColors = {
      blue: { primary: '#3b82f6', accent: '#60a5fa' },
      purple: { primary: '#8b5cf6', accent: '#a78bfa' },
      green: { primary: '#10b981', accent: '#34d399' },
      red: { primary: '#ef4444', accent: '#f87171' },
      orange: { primary: '#f97316', accent: '#fb923c' },
      pink: { primary: '#ec4899', accent: '#f472b6' },
    };
    
    // Gabungkan tema default dengan warna tema yang dipilih
    return {
      ...newTheme,
      primary: themeColors[savedThemeName].primary,
      secondary: themeColors[savedThemeName].accent,
    };
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cek preferensi tema dari localStorage atau preferensi sistem
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [themeTransitioning, setThemeTransitioning] = useState(false);

  // Deteksi perangkat mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Efek untuk menerapkan tema ke dokumen dengan transisi yang lebih halus
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Toggle tema gelap/terang dengan animasi transisi
  const toggleTheme = () => {
    setThemeTransitioning(true);
    setTimeout(() => {
      setIsDarkMode(prev => !prev);
      setTimeout(() => {
        setThemeTransitioning(false);
      }, 300);
    }, 100);
  };

  // Fungsi untuk mengubah tema warna
  const setThemeColor = (themeName) => {
    // Warna tema sesuai dengan yang tersedia di SettingsPage
    const themeColors = {
      blue: { primary: '#3b82f6', accent: '#60a5fa' },
      purple: { primary: '#8b5cf6', accent: '#a78bfa' },
      green: { primary: '#10b981', accent: '#34d399' },
      red: { primary: '#ef4444', accent: '#f87171' },
      orange: { primary: '#f97316', accent: '#fb923c' },
      pink: { primary: '#ec4899', accent: '#f472b6' },
    };
    
    // Simpan tema yang dipilih ke localStorage
    localStorage.setItem('themeName', themeName);
    setCurrentThemeName(themeName);
    
    // Update tema dengan warna yang dipilih
    setTheme(prevTheme => ({
      ...prevTheme,
      primary: themeColors[themeName].primary,
      secondary: themeColors[themeName].accent,
    }));
  };

  // Tema yang diperluas dengan mode gelap/terang
  const extendedTheme = {
    ...theme,
    isDarkMode,
    toggleTheme,
    themeTransitioning,
    name: currentThemeName,
    // Warna yang disesuaikan berdasarkan mode
    current: {
      background: isDarkMode ? theme.background.dark : theme.background.light,
      text: isDarkMode ? theme.text.light : theme.text.primary,
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      // Efek kaca yang disesuaikan berdasarkan mode
      glassEffect: isDarkMode ? theme.glass.dark : theme.glass.light,
    },
    // Fungsi untuk parallax scroll
    parallax: {
      useParallax: (value, distance) => {
        const { scrollYProgress } = useScroll();
        return useTransform(
          scrollYProgress, 
          [0, 1], 
          [value, value + distance]
        );
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: extendedTheme, 
      setTheme: setThemeColor, 
      isMobile, 
      isDarkMode, 
      toggleTheme,
      themeTransitioning,
      animations: enhancedAnimations,
      currentThemeName
    }}>
      <div className={`theme-transition ${themeTransitioning ? 'transitioning' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook untuk menggunakan theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// HOC untuk mendukung animasi page transition dengan efek yang lebih halus
export const withPageTransition = (Component) => {
  return (props) => {
    const { isDarkMode, themeTransitioning, animations } = useTheme();
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={animations.page.initial}
          animate={animations.page.animate}
          exit={animations.page.exit}
          className={`w-full ${themeTransitioning ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            willChange: 'opacity, transform',
            transform: 'translateZ(0)',
            transition: 'opacity 0.3s ease'
          }}
        >
          <Component {...props} />
        </motion.div>
      </AnimatePresence>
    );
  };
};

// Parallax HOC untuk komponen dengan efek parallax
export const withParallaxEffect = (Component) => {
  return (props) => {
    return (
      <motion.div
        style={{
          position: 'relative',
          zIndex: 1,
          willChange: 'transform'
        }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
};

// Export animations dari tema bersama
export const animations = enhancedAnimations; 
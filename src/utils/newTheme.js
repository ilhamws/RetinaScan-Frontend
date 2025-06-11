// Tema baru dengan warna yang lebih modern dan menarik
export const newTheme = {
  // Warna Utama
  primary: '#4F46E5', // Indigo-600 (warna utama)
  secondary: '#06B6D4', // Cyan-500 (warna sekunder)
  accent: '#8B5CF6', // Violet-500 (warna aksen)
  success: '#10B981', // Green-500
  warning: '#F59E0B', // Amber-500
  danger: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500
  
  // Warna Background
  background: {
    light: '#F9FAFB', // Gray-50
    dark: '#111827', // Gray-900
    gradient: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)', // Blue-50 to Indigo-50
    glass: 'rgba(255, 255, 255, 0.8)',
    darkGlass: 'rgba(17, 24, 39, 0.8)'
  },
  
  // Warna Teks
  text: {
    primary: '#111827', // Gray-900
    secondary: '#4B5563', // Gray-600
    light: '#F9FAFB', // Gray-50
    muted: '#9CA3AF', // Gray-400
    accent: '#4F46E5' // Indigo-600
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #4F46E5, #6366F1)', // Indigo-600 to Indigo-500
    secondary: 'linear-gradient(135deg, #06B6D4, #22D3EE)', // Cyan-500 to Cyan-400
    accent: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', // Violet-500 to Violet-400
    success: 'linear-gradient(135deg, #10B981, #34D399)', // Green-500 to Green-400
    warning: 'linear-gradient(135deg, #F59E0B, #FBBF24)', // Amber-500 to Amber-400
    danger: 'linear-gradient(135deg, #EF4444, #F87171)', // Red-500 to Red-400
    cool: 'linear-gradient(135deg, #3B82F6, #06B6D4)', // Blue-500 to Cyan-500
    purple: 'linear-gradient(135deg, #8B5CF6, #EC4899)', // Violet-500 to Pink-500
    sunset: 'linear-gradient(135deg, #F59E0B, #EF4444)', // Amber-500 to Red-500
    ocean: 'linear-gradient(135deg, #06B6D4, #3B82F6)', // Cyan-500 to Blue-500
    retina: 'linear-gradient(135deg, #4F46E5, #8B5CF6, #EC4899)', // Indigo-600 to Violet-500 to Pink-500
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    colored: '0 10px 20px -10px rgba(79, 70, 229, 0.5)', // Shadow dengan warna indigo
    glow: '0 0 15px rgba(79, 70, 229, 0.5)', // Glow effect dengan warna indigo
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  // Glass Effects
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
    },
    dark: {
      background: 'rgba(17, 24, 39, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
    },
    colored: {
      background: 'rgba(79, 70, 229, 0.15)', // Indigo dengan transparansi
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(79, 70, 229, 0.3)',
      boxShadow: '0 4px 30px rgba(79, 70, 229, 0.2)'
    }
  },
  
  // Animations
  transitions: {
    fast: 'all 0.15s ease',
    default: 'all 0.3s ease',
    slow: 'all 0.5s ease',
    bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

// Animasi yang lebih menarik untuk Framer Motion
export const enhancedAnimations = {
  // Fade in dengan bounce effect
  fadeInUp: {
    hidden: { y: 40, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        delay,
        duration: 0.8
      }
    })
  },
  
  // Fade in dari atas dengan bounce effect
  fadeInDown: {
    hidden: { y: -40, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        delay,
        duration: 0.8
      }
    })
  },
  
  // Fade in dari kiri dengan bounce effect
  fadeInLeft: {
    hidden: { x: -60, opacity: 0 },
    visible: (delay = 0) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        delay,
        duration: 0.8
      }
    })
  },
  
  // Fade in dari kanan dengan bounce effect
  fadeInRight: {
    hidden: { x: 60, opacity: 0 },
    visible: (delay = 0) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        delay,
        duration: 0.8
      }
    })
  },
  
  // Scale in dengan bounce
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (delay = 0) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        delay,
        duration: 0.8
      }
    })
  },
  
  // Container untuk elemen staggered dengan delay yang lebih baik
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  },
  
  // Item untuk container staggered
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  },
  
  // Card animations yang lebih menarik
  card: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    hover: { 
      scale: 1.03, 
      y: -5, 
      boxShadow: '0 15px 30px -5px rgba(79, 70, 229, 0.2)',
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98, transition: { duration: 0.15 } }
  },
  
  // Button animations yang lebih responsif
  button: {
    hover: { 
      scale: 1.05, 
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', 
      transition: { duration: 0.2 } 
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  },
  
  // Page transition yang lebih halus
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  },
  
  // Modal animations dengan scale dan fade
  modal: {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.3 }
    }
  },
  
  // Dropdown animations yang lebih halus
  dropdown: {
    hidden: { opacity: 0, height: 0, scale: 0.95, transformOrigin: 'top' },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      scale: 1,
      transition: { 
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 },
        scale: { duration: 0.2, delay: 0.1 }
      } 
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      scale: 0.95,
      transition: { 
        height: { duration: 0.2 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      } 
    }
  },
  
  // Toast notification animation dengan slide dan fade
  toast: {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 300,
        duration: 0.4 
      } 
    },
    exit: { 
      opacity: 0, 
      x: 50, 
      scale: 0.9,
      transition: { duration: 0.3 } 
    }
  },
  
  // Hover effect untuk link
  link: {
    initial: { backgroundSize: '0% 2px', backgroundPosition: '0 100%' },
    hover: { 
      backgroundSize: '100% 2px',
      transition: { duration: 0.3 }
    }
  },
  
  // Floating animation untuk elemen dekoratif
  floating: {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  },
  
  // Pulse animation untuk elemen yang perlu perhatian
  pulse: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  },
  
  // Rotate animation untuk loading atau elemen dekoratif
  rotate: {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear'
      }
    }
  },
  
  // Wave animation untuk elemen dekoratif
  wave: {
    initial: { pathLength: 0, pathOffset: 0 },
    animate: {
      pathLength: 1,
      pathOffset: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  }
};

// Konfigurasi untuk animasi Lottie
export const lottieConfig = {
  defaultOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  },
  // Beberapa ID animasi Lottie yang bisa digunakan
  animations: {
    eyeScan: 'https://assets3.lottiefiles.com/packages/lf20_xgdtj2yh.json', // Animasi pemindaian mata
    medicalScan: 'https://assets10.lottiefiles.com/packages/lf20_tutvdkg0.json', // Animasi scan medis
    loading: 'https://assets9.lottiefiles.com/packages/lf20_x62chJ.json', // Loading spinner
    success: 'https://assets10.lottiefiles.com/packages/lf20_atippmse.json', // Animasi sukses
    error: 'https://assets2.lottiefiles.com/packages/lf20_qpwbiyxf.json', // Animasi error
    wave: 'https://assets7.lottiefiles.com/packages/lf20_jtbfg2nb.json', // Animasi gelombang
    login: 'https://assets2.lottiefiles.com/packages/lf20_k9wsvzgd.json', // Animasi login
    register: 'https://assets10.lottiefiles.com/packages/lf20_q5qvqtnr.json', // Animasi register
    forgotPassword: 'https://assets7.lottiefiles.com/packages/lf20_uu0x8lqv.json', // Animasi lupa password
    resetPassword: 'https://assets10.lottiefiles.com/private_files/lf30_GjhcdM.json', // Animasi reset password
    eye: 'https://assets3.lottiefiles.com/packages/lf20_ydo1amjm.json', // Animasi mata
    medicalData: 'https://assets7.lottiefiles.com/packages/lf20_5njp3vgg.json', // Animasi data medis
    security: 'https://assets10.lottiefiles.com/packages/lf20_vvnvemp9.json' // Animasi keamanan
  }
};

// Export untuk penggunaan
export default {
  theme: newTheme,
  animations: enhancedAnimations,
  lottie: lottieConfig
}; 
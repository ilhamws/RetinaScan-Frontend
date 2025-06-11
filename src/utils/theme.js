// Tema bersama untuk frontend dan dashboard
export const globalTheme = {
  primary: '#3B82F6', // Blue-600
  secondary: '#10B981', // Green-500
  accent: '#8B5CF6', // Violet-500
  background: '#F9FAFB', // gray-50
  text: '#1F2937', // gray-800
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
  accentGradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
  blueGradient: 'linear-gradient(135deg, #2563EB, #3B82F6)',
  purpleGradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  successGradient: 'linear-gradient(135deg, #10B981, #34D399)', 
  warningGradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
  dangerGradient: 'linear-gradient(135deg, #EF4444, #F87171)',
  
  // Shadows
  smallShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  mediumShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  largeShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Border Radius
  borderRadiusSm: '0.375rem',
  borderRadiusMd: '0.5rem',
  borderRadiusLg: '0.75rem',
  borderRadiusXl: '1rem',
  borderRadiusFull: '9999px',
  
  // Animations
  transitionFast: 'all 0.2s ease',
  transitionNormal: 'all 0.3s ease', 
  transitionSlow: 'all 0.5s ease',
  
  // Glass Effect
  glassEffect: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  // Dark Glass Effect
  darkGlassEffect: {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  }
};

// Animations untuk Framer Motion yang bisa digunakan di kedua aplikasi
export const animations = {
  // Fade in dari bawah (untuk elemen individu)
  fadeInUp: {
    hidden: { y: 20, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Fade in dari atas
  fadeInDown: {
    hidden: { y: -20, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Fade in dari kiri
  fadeInLeft: {
    hidden: { x: -20, opacity: 0 },
    visible: (delay = 0) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Fade in dari kanan
  fadeInRight: {
    hidden: { x: 20, opacity: 0 },
    visible: (delay = 0) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Container untuk elemen staggered
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  // Item untuk container staggered
  item: {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    }
  },
  
  // Card animations
  card: {
    initial: { scale: 0.97, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, y: -3, boxShadow: '0 10px 15px -5px rgba(0, 0, 0, 0.1)' },
    tap: { scale: 0.98 }
  },
  
  // Button animations
  button: {
    hover: { scale: 1.03, transition: { duration: 0.15 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  },
  
  // Page transition
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  // Modal animations
  modal: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  },
  
  // Dropdown animations
  dropdown: {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  },
  
  // Toast notification animation
  toast: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
  }
}; 
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Komponen optimasi ekstrem untuk mobile yang menggunakan pendekatan berbeda
// untuk mencapai performa 60fps tanpa patah-patah
const MobileOptimizedVantaBackground = ({ 
  children, 
  className = '',
  backgroundColor = 0x0,
  color1 = 0x5288e,
  color2 = 0x1399ff,
  backgroundAlpha = 0.0
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      return Boolean(
        userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
      );
    };
    
    setIsMobile(checkMobile());
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Inisialisasi canvas dan animasi ringan
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Setup canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set ukuran canvas
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    
    // Konversi warna hex ke RGB
    const hexToRgb = (hex) => {
      const bigint = parseInt(String(hex).replace(/^0x/, ''), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      };
    };
    
    const bgColor = hexToRgb(backgroundColor);
    const primColor = hexToRgb(color1);
    const secColor = hexToRgb(color2);
    
    // Buat gradient background
    const createBackground = () => {
      if (backgroundAlpha > 0) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${backgroundAlpha})`);
        gradient.addColorStop(1, `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${backgroundAlpha * 0.7})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    // Buat particles sederhana
    const particleCount = Math.min(15, Math.floor(windowSize.width * windowSize.height / 50000));
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: Math.random() > 0.5 ? primColor : secColor
      });
    }
    
    // Animasi ringan dengan Canvas 2D (bukan WebGL)
    const animate = () => {
      createBackground();
      
      // Update dan render particles
      particles.forEach(particle => {
        // Update posisi
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary checking dengan wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Render particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.7)`;
        ctx.fill();
        
        // Render garis penghubung jika cukup dekat
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [windowSize, backgroundColor, color1, color2, backgroundAlpha]);

  return (
    <div 
      ref={containerRef} 
      className={`mobile-optimized-vanta-background ${className}`} 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        top: 0, 
        left: 0, 
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

MobileOptimizedVantaBackground.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number
};

export default MobileOptimizedVantaBackground; 
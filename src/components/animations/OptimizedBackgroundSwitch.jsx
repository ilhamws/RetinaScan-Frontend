import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import VantaBackground from './VantaBackground';

// Komponen StaticBackground yang sangat ringan untuk perangkat dengan performa sangat rendah
const StaticBackground = ({ backgroundColor, backgroundAlpha, color1, color2, children }) => {
  // Menggunakan CSS gradien statis daripada animasi 3D
  return (
    <div 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: typeof backgroundColor === 'number' 
          ? `#${backgroundColor.toString(16).padStart(6, '0')}`
          : backgroundColor || '#000000',
        opacity: backgroundAlpha !== undefined ? backgroundAlpha : 1,
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* Menambahkan elemen dekoratif statis yang mirip dengan birds */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 70% 30%, ${
            typeof color1 === 'number' ? `#${color1.toString(16).padStart(6, '0')}33` : 'rgba(0, 119, 255, 0.2)'
          }, transparent 50%), 
          radial-gradient(circle at 30% 70%, ${
            typeof color2 === 'number' ? `#${color2.toString(16).padStart(6, '0')}33` : 'rgba(65, 105, 225, 0.2)'
          }, transparent 50%)`,
          zIndex: 0
        }}
      />
      
      {/* Beberapa "burung" statis yang dibuat dengan CSS */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            width: '8px',
            height: '3px',
            borderRadius: '50%',
            background: typeof color1 === 'number' 
              ? `#${color1.toString(16).padStart(6, '0')}`
              : '#0077ff',
            opacity: 0.7,
            transform: `rotate(${Math.random() * 360}deg)`,
            zIndex: 1
          }}
        />
      ))}
      
      {children}
    </div>
  );
};

StaticBackground.propTypes = {
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number,
  color1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node
};

// Komponen ini akan menggunakan konfigurasi yang sama untuk semua perangkat
const OptimizedBackgroundSwitch = (props) => {
  const [hasTested, setHasTested] = useState(false);
  const [useStaticBackground, setUseStaticBackground] = useState(false);

  useEffect(() => {
    const detectVeryLowPerformanceDevice = () => {
      // Deteksi perangkat yang sangat lemah yang tidak bisa menjalankan WebGL sama sekali
      const userAgent = navigator.userAgent || '';
      
      // Cek browser dengan kemampuan WebGL sangat terbatas
      let hasWebGL = false;
      try {
        const canvas = document.createElement('canvas');
        hasWebGL = !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        hasWebGL = false;
      }
      
      // Jika WebGL tidak tersedia atau device sangat lemah, gunakan StaticBackground
      if (!hasWebGL) {
        console.log('WebGL tidak tersedia - menggunakan StaticBackground');
        setUseStaticBackground(true);
      } else {
        setUseStaticBackground(false);
      }
      
      setHasTested(true);
    };
    
    // Tambahkan sedikit delay untuk memberi waktu halaman dimuat
    const timerId = setTimeout(detectVeryLowPerformanceDevice, 100);
    return () => clearTimeout(timerId);
  }, []);
  
  // Tampilkan placeholder saat deteksi belum selesai
  if (!hasTested) {
    return (
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: props.backgroundColor || '#000000',
          opacity: props.backgroundAlpha || 0,
          zIndex: 0
        }}
      >
        {props.children}
      </div>
    );
  }
  
  // Untuk perangkat yang tidak mendukung WebGL sama sekali
  if (useStaticBackground) {
    return (
      <StaticBackground {...props} />
    );
  }
  
  // Konfigurasi standar untuk semua perangkat
  const standardBirdSize = 1.0;  // Ukuran burung 1.0 untuk semua perangkat
  const standardQuantity = 2.0;  // Jumlah burung 2.0 untuk semua perangkat
  const standardSpeed = 5.0;     // Kecepatan 5.0 untuk semua perangkat
  
  // Gunakan VantaBackground dengan konfigurasi standar
  return (
    <VantaBackground 
      {...props} 
      birdSize={standardBirdSize}
      quantity={standardQuantity}
      speedLimit={standardSpeed}
    />
  );
};

OptimizedBackgroundSwitch.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number,
  // Semua props lainnya akan dilewatkan ke komponen background
};

export default OptimizedBackgroundSwitch; 
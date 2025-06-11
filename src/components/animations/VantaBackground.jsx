import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const VantaBackground = ({ 
  children, 
  className = '',
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1.00,
  scaleMobile = 1.00,
  backgroundColor = 0x0,
  color1 = 0x5288e,
  color2 = 0x1399ff,
  colorMode = "variance",
  birdSize = 1.5,
  wingSpan = 30.0,
  speedLimit = 5.0,
  separation = 100.0,
  alignment = 20.0,
  cohesion = 20.0,
  quantity = 3.0,
  backgroundAlpha = 0.0,
  forceMobileHighPerformance = true // New prop to force high performance on mobile
}) => {
  const vantaRef = useRef(null);
  const containerRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [devicePerformance, setDevicePerformance] = useState('high'); // 'very-low', 'low', 'medium', 'high'
  const [isTabActive, setIsTabActive] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const frameCounterRef = useRef(0);
  const fpsMonitorRef = useRef(null);
  const lastFpsUpdateRef = useRef(Date.now());
  const actualFpsRef = useRef(60);
  const devicePixelRatioRef = useRef(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const forceHighPerformanceRef = useRef(forceMobileHighPerformance);

  // Advanced performance detection
  useEffect(() => {
    const checkPerformance = () => {
      // Check if device is mobile first
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
      );
      setIsMobile(mobile);
      
      // Store device pixel ratio
      devicePixelRatioRef.current = window.devicePixelRatio || 1;
      
      // Force high performance mode
      setDevicePerformance('high');
      
      // Start FPS monitoring for dynamic adjustments
      startFpsMonitoring();
    };
    
    // FPS monitoring for dynamic performance adjustment
    const startFpsMonitoring = () => {
      if (fpsMonitorRef.current) return;
      
      let lastTime = performance.now();
      let frames = 0;
      
      const checkFps = () => {
        const now = performance.now();
        frames++;
        
        // Update FPS every second
        if (now - lastFpsUpdateRef.current >= 1000) {
          const currentFps = Math.round((frames * 1000) / (now - lastFpsUpdateRef.current));
          actualFpsRef.current = currentFps;
          
          // Only log FPS but don't adjust settings
          if (currentFps < 30) {
            console.log(`FPS is ${currentFps}`);
          }
          
          lastFpsUpdateRef.current = now;
          frames = 0;
        }
        
        lastTime = now;
        fpsMonitorRef.current = requestAnimationFrame(checkFps);
      };
      
      fpsMonitorRef.current = requestAnimationFrame(checkFps);
    };
    
    checkPerformance();
    
    // Check again if window size changes
    const handleResize = () => {
      // Use throttling to prevent excessive calls
      if (!window.resizeThrottleTimeout) {
        window.resizeThrottleTimeout = setTimeout(() => {
          window.resizeThrottleTimeout = null;
          checkPerformance();
        }, 250);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.resizeThrottleTimeout) {
        clearTimeout(window.resizeThrottleTimeout);
      }
      
      // Clean up FPS monitoring
      if (fpsMonitorRef.current) {
        cancelAnimationFrame(fpsMonitorRef.current);
        fpsMonitorRef.current = null;
      }
    };
  }, [devicePerformance, forceMobileHighPerformance]);

  // Check if scripts are loaded
  useEffect(() => {
    const checkScriptsLoaded = () => {
      if (typeof window !== 'undefined' && window.THREE && window.VANTA && window.VANTA.BIRDS) {
        console.log('THREE and VANTA scripts detected');
        setIsScriptLoaded(true);
        return true;
      }
      return false;
    };

    // Initial check
    const isLoaded = checkScriptsLoaded();
    if (!isLoaded) {
      console.log('Scripts not detected, waiting for vantaLoaded event');
      
      // Listen for custom event from index.html
      const handleVantaLoaded = () => {
        console.log('Vanta loaded event received');
        setIsScriptLoaded(true);
      };
      
      document.addEventListener('vantaLoaded', handleVantaLoaded);
      
      return () => {
        document.removeEventListener('vantaLoaded', handleVantaLoaded);
      };
    }
  }, [isScriptLoaded, retryCount]);

  // Intersection Observer to check if component is in viewport
  useEffect(() => {
    if (!vantaRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInViewport(entry.isIntersecting);
        
        // Pause/resume animation based on visibility
        if (vantaEffect && vantaEffect.setOptions) {
          if (!entry.isIntersecting) {
            vantaEffect.setOptions({ fps: 0 }); // Pause when not in viewport
          } else if (isTabActive) {
            // Resume only if tab is active - always use 60fps on mobile with forceMobileHighPerformance
            const fps = forceHighPerformanceRef.current ? 60 :
                       devicePerformance === 'very-low' ? 20 : 
                       devicePerformance === 'low' ? 30 : 
                       devicePerformance === 'medium' ? 45 : 60;
            vantaEffect.setOptions({ fps });
          }
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% is visible
    );
    
    observer.observe(vantaRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [vantaEffect, isTabActive, devicePerformance, forceMobileHighPerformance]);

  // Initialize Vanta effect
  useEffect(() => {
    // Only proceed if scripts are loaded
    if (!isScriptLoaded) return;
    
    // Check if we're in a browser environment (not SSR)
    if (typeof window === 'undefined') return;
    
    // Cleanup previous effect
    if (vantaEffect) {
      console.log('Destroying previous Vanta effect');
      vantaEffect.destroy();
    }
    
    // Only initialize if the ref exists and scripts are loaded
    if (!vantaRef.current) {
      console.log('Ref not available yet');
      return;
    }
    
    if (!window.VANTA || !window.VANTA.BIRDS) {
      console.error('Vanta.js or Three.js not loaded properly');
      return;
    }

    // Use requestIdleCallback to initialize when browser is idle
    const initializeVanta = () => {
      try {
        console.log('Initializing Vanta effect');
        
        // Store the class name in containerRef for optimization detection
        if (className) {
          containerRef.current = { classList: { contains: (cls) => className.includes(cls) } };
        }
        
        // Gunakan parameter yang sama untuk semua device
        let performanceSettings = {
          actualBirdSize: birdSize,
          actualQuantity: quantity,
          actualSpeedLimit: speedLimit,
          actualFps: 60,
          actualWingSpan: wingSpan,
          actualSeparation: separation,
          actualAlignment: alignment,
          actualCohesion: cohesion
        };
        
        // Use requestAnimationFrame to optimize rendering
        let lastTime = 0;
        const targetFps = performanceSettings.actualFps;
        const frameInterval = 1000 / targetFps;
        
        // Initialize the effect with optimized settings
        const effect = window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: mouseControls,
          touchControls: touchControls,
          gyroControls: gyroControls,
          minHeight,
          minWidth,
          scale: isMobile ? scaleMobile : scale,
          scaleMobile,
          backgroundColor,
          color1,
          color2,
          colorMode,
          birdSize: performanceSettings.actualBirdSize,
          wingSpan: performanceSettings.actualWingSpan,
          speedLimit: performanceSettings.actualSpeedLimit,
          separation: performanceSettings.actualSeparation,
          alignment: performanceSettings.actualAlignment,
          cohesion: performanceSettings.actualCohesion,
          quantity: performanceSettings.actualQuantity,
          backgroundAlpha,
          fps: isInViewport && isTabActive ? performanceSettings.actualFps : 0, // Start paused if not visible
          frameRequestCallback: (time) => {
            // Throttle frame requests based on target FPS
            frameCounterRef.current++;
            if (time - lastTime >= frameInterval) {
              lastTime = time;
              return true;
            }
            return false;
          }
        });

        // Add renderer optimizations if available
        if (effect && effect.renderer) {
          effect.renderer.setPixelRatio(Math.min(2.0, window.devicePixelRatio || 1));
        }

        console.log('Vanta effect initialized successfully');
        setVantaEffect(effect);
      } catch (error) {
        console.error('Error initializing Vanta effect:', error);
      }
    };
    
    // Use requestIdleCallback if available, otherwise use setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initializeVanta, { timeout: 1000 });
    } else {
      setTimeout(initializeVanta, 100);
    }

    // Cleanup on unmount
    return () => {
      if (vantaEffect) {
        console.log('Cleaning up Vanta effect');
        vantaEffect.destroy();
      }
    };
  }, [
    isScriptLoaded,
    isMobile,
    devicePerformance,
    mouseControls,
    touchControls,
    gyroControls,
    minHeight,
    minWidth,
    scale,
    scaleMobile,
    backgroundColor,
    color1,
    color2,
    colorMode,
    birdSize,
    wingSpan,
    speedLimit,
    separation,
    alignment,
    cohesion,
    quantity,
    backgroundAlpha,
    isInViewport,
    isTabActive,
    forceMobileHighPerformance
  ]);

  // Optimized mouse movement handler with debounce
  const handleMouseMove = useCallback((e) => {
    if (!vantaEffect || devicePerformance === 'very-low') return;
    
    // Store mouse position in ref to avoid re-renders
    mousePositionRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    };
    
    // Only update state occasionally to avoid re-renders
    if (frameCounterRef.current % 10 === 0) {
      setMousePosition(mousePositionRef.current);
    }
  }, [vantaEffect, devicePerformance]);

  // Handle window resize for better performance
  useEffect(() => {
    if (!vantaEffect) return;

    const handleResize = () => {
      if (vantaEffect && vantaEffect.resize) {
        vantaEffect.resize();
        
        // Adjust renderer size based on device performance
        if (vantaEffect.renderer) {
          if (forceHighPerformanceRef.current && isMobile) {
            // For mobile high performance mode, use a fixed size for better performance
            const canvasWidth = Math.min(1440, window.innerWidth);
            const canvasHeight = Math.min(900, window.innerHeight);
            vantaEffect.renderer.setSize(canvasWidth, canvasHeight);
          } else if (devicePerformance === 'very-low' || devicePerformance === 'low') {
            vantaEffect.renderer.setSize(
              Math.min(1024, window.innerWidth),
              Math.min(768, window.innerHeight)
            );
          }
        }
      }
    };

    // Throttle the resize handler for better performance
    let timeoutId;
    let lastExecution = 0;
    const throttleDelay = devicePerformance === 'very-low' ? 500 : 
                         devicePerformance === 'low' ? 300 : 200; // ms
    
    const throttledResize = () => {
      const now = Date.now();
      if (now - lastExecution > throttleDelay) {
        handleResize();
        lastExecution = now;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, throttleDelay);
      }
    };

    window.addEventListener('resize', throttledResize);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, [vantaEffect, devicePerformance, isMobile, forceMobileHighPerformance]);

  // Add visibility change handler to pause animation when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabActive(isVisible);
      
      if (vantaEffect && vantaEffect.setOptions) {
        if (!isVisible) {
          // Pause animation when tab is not visible
          vantaEffect.setOptions({ fps: 0 });
        } else if (isInViewport) {
          // Resume normal animation when tab is visible again and component is in viewport
          const fps = forceHighPerformanceRef.current ? 60 :
                     devicePerformance === 'very-low' ? 20 : 
                     devicePerformance === 'low' ? 30 : 
                     devicePerformance === 'medium' ? 45 : 60;
          vantaEffect.setOptions({ fps });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [vantaEffect, devicePerformance, isInViewport, forceMobileHighPerformance]);

  // Add mouse event listeners with performance considerations
  useEffect(() => {
    if (devicePerformance === 'very-low') return; // Skip for very low-end devices
    
    // Add event listener only if mouse controls are enabled
    if (mouseControls) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    return () => {
      if (mouseControls) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseControls, handleMouseMove, devicePerformance]);

  // Tambahkan pengoptimalan memori
  useEffect(() => {
    // Bersihkan cache THREE.js setiap kali component di-unmount
    return () => {
      if (window.THREE && window.THREE.Cache) {
        window.THREE.Cache.clear();
      }
      
      // Bersihkan tekstur yang tidak digunakan
      if (window.THREE && window.THREE.TextureLoader) {
        const renderer = vantaEffect && vantaEffect.renderer;
        if (renderer && renderer.info && renderer.info.memory) {
          const textures = renderer.info.memory.textures || 0;
          console.log(`Cleaning up ${textures} textures`);
        }
      }
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={vantaRef}
      className={`vanta-background ${className}`} 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        top: 0, 
        left: 0, 
        zIndex: 0,
        // Add will-change for better performance
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        // Additional optimizations
        pointerEvents: devicePerformance === 'very-low' ? 'none' : undefined, // Prevent unnecessary hover events on low-end devices
        // Reduce quality on very low-end devices
        filter: devicePerformance === 'very-low' ? 'blur(1px)' : undefined,
        opacity: devicePerformance === 'very-low' ? 0.9 : 1,
      }}
      aria-hidden="true" // For accessibility, this is just decorative
    >
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

VantaBackground.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  mouseControls: PropTypes.bool,
  touchControls: PropTypes.bool,
  gyroControls: PropTypes.bool,
  minHeight: PropTypes.number,
  minWidth: PropTypes.number,
  scale: PropTypes.number,
  scaleMobile: PropTypes.number,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  colorMode: PropTypes.string,
  birdSize: PropTypes.number,
  wingSpan: PropTypes.number,
  speedLimit: PropTypes.number,
  separation: PropTypes.number,
  alignment: PropTypes.number,
  cohesion: PropTypes.number,
  quantity: PropTypes.number,
  backgroundAlpha: PropTypes.number,
  forceMobileHighPerformance: PropTypes.bool
};

export default VantaBackground; 
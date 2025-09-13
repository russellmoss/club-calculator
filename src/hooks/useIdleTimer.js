import { useEffect, useRef, useState } from 'react';

const useIdleTimer = (onIdle, idleTime = 180000) => {
  const idleTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef(Date.now());

  const reset = () => {
    lastActivityRef.current = Date.now();
    
    if (isIdle) {
      console.log('Resetting idle timer from idle state', new Date().toISOString());
    }
    
    setIsIdle(false);
    setTimeLeft(0);

    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Start countdown after 30 seconds of inactivity
    idleTimeoutRef.current = setTimeout(() => {
      console.log('Starting countdown...', new Date().toISOString());
      setIsIdle(true);
      setTimeLeft(150); // 2:30 in seconds
      
      // Update countdown every second
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            console.log('Countdown finished, calling onIdle...', new Date().toISOString());
            clearInterval(countdownIntervalRef.current);
            onIdle();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 30000); // 30 seconds before showing countdown
  };

  useEffect(() => {
    console.log('Setting up idle timer...', new Date().toISOString());
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'input',
      'change'
    ];

    const eventHandler = () => {
      const now = Date.now();
      // Throttle resets to avoid excessive function calls
      if (now - lastActivityRef.current > 1000) {
        console.log('User activity detected', new Date().toISOString());
        reset();
      }
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, eventHandler);
      console.log(`Added event listener for ${event}`);
    });

    // Initial setup
    reset();

    return () => {
      console.log('Cleaning up idle timer...', new Date().toISOString());
      events.forEach(event => {
        window.removeEventListener(event, eventHandler);
      });
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [onIdle]);

  return { timeLeft, reset, isIdle };
};

export default useIdleTimer; 
import { useEffect, useRef, useState } from 'react';

const useIdleTimer = (onIdle, idleTime = 180000) => {
  const idleTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  const reset = () => {
    console.log('Resetting idle timer...');
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
      console.log('Starting countdown...');
      setIsIdle(true);
      setTimeLeft(150); // 2:30 in seconds
      
      // Update countdown every second
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            console.log('Countdown finished, calling onIdle...');
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
    console.log('Setting up idle timer...');
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'input',
      'change',
      'focus',
      'blur'
    ];

    const eventHandler = () => {
      console.log('User activity detected, resetting timer...');
      reset();
    };

    events.forEach(event => {
      document.addEventListener(event, eventHandler, true);
    });

    // Initial setup
    reset();

    return () => {
      console.log('Cleaning up idle timer...');
      events.forEach(event => {
        document.removeEventListener(event, eventHandler, true);
      });
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [onIdle]);

  return { timeLeft, reset };
};

export default useIdleTimer; 
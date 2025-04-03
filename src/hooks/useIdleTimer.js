import { useEffect, useRef } from 'react';

const useIdleTimer = (onIdle, idleTime = 180000) => {
  const idleTimeoutRef = useRef(null);
  const idleIntervalRef = useRef(null);

  const reset = () => {
    console.log('Resetting idle timer...');
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current);
    }

    idleTimeoutRef.current = setTimeout(() => {
      console.log('Idle timeout reached, calling onIdle...');
      onIdle();
    }, idleTime);
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
      if (idleIntervalRef.current) {
        clearInterval(idleIntervalRef.current);
      }
    };
  }, [onIdle, idleTime]);

  return { reset };
};

export default useIdleTimer; 
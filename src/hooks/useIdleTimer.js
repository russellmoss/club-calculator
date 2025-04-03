import { useEffect, useRef } from 'react';

const useIdleTimer = (onIdle, idleTime = 180000) => {
  const idleTimeoutRef = useRef(null);
  const idleIntervalRef = useRef(null);

  const reset = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current);
    }

    idleTimeoutRef.current = setTimeout(() => {
      onIdle();
    }, idleTime);
  };

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart'
    ];

    const eventHandler = () => {
      reset();
    };

    events.forEach(event => {
      document.addEventListener(event, eventHandler);
    });

    reset();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, eventHandler);
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
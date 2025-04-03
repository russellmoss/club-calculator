import React from 'react';
import { useLocation } from 'react-router-dom';
import useIdleTimer from '../../hooks/useIdleTimer';
import IdleTimerDisplay from './IdleTimerDisplay';

const IdleTimerWrapper = ({ children, onIdle }) => {
  const location = useLocation();
  const isStartPage = location.pathname === '/';
  
  // Only use the idle timer if we're not on the start page
  const { timeLeft, reset, isIdle } = isStartPage 
    ? { timeLeft: 0, reset: () => {}, isIdle: false }
    : useIdleTimer(onIdle, 180000);

  return (
    <>
      {children}
      {!isStartPage && (
        <IdleTimerDisplay timeLeft={timeLeft} onReset={reset} isIdle={isIdle} />
      )}
    </>
  );
};

export default IdleTimerWrapper; 
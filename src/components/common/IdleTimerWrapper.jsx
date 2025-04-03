import React from 'react';
import { useLocation } from 'react-router-dom';
import useIdleTimer from '../../hooks/useIdleTimer';
import IdleTimerDisplay from './IdleTimerDisplay';

const IdleTimerWrapper = ({ children, onIdle }) => {
  const location = useLocation();
  const isStartPage = location.pathname === '/';
  
  // Always call the hook, but only use its values if not on start page
  const idleTimer = useIdleTimer(onIdle, 180000);
  const { timeLeft, reset, isIdle } = isStartPage 
    ? { timeLeft: 0, reset: () => {}, isIdle: false }
    : idleTimer;

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
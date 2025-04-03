import React, { useState, useEffect } from 'react';

const IdleTimerDisplay = ({ timeLeft, onReset }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('IdleTimerDisplay: timeLeft changed to', timeLeft);
    if (timeLeft > 0) {
      console.log('IdleTimerDisplay: Showing timer');
      setIsVisible(true);
    } else {
      console.log('IdleTimerDisplay: Hiding timer');
      setIsVisible(false);
    }
  }, [timeLeft]);

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50">
      <div className="flex items-center space-x-4">
        <div className="text-gray-700">
          <p className="text-sm font-medium">Session will reset in:</p>
          <p className="text-xl font-bold text-primary">{formattedTime}</p>
        </div>
        <button
          onClick={() => {
            console.log('IdleTimerDisplay: Stay Active button clicked');
            onReset();
          }}
          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-darkBrownHover transition-colors"
        >
          Stay Active
        </button>
      </div>
    </div>
  );
};

export default IdleTimerDisplay; 
import React from 'react';

const IdleTimerDisplay = ({ timeLeft, onReset, isIdle }) => {
  if (!isIdle || timeLeft === 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-fade-in transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="text-gray-700">
            <p className="text-sm font-medium">Session will reset in:</p>
            <p className="text-xl font-bold text-primary">{formattedTime}</p>
          </div>
          <button
            onClick={onReset}
            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-darkBrownHover transition-colors duration-200"
          >
            Stay Active
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdleTimerDisplay; 
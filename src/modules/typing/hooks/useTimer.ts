import { useEffect, useRef, useState } from 'react';
import { useTypingStore } from '@/store/useTypingStore';

/**
 * Custom hook to manage the Typing Exam Timer
 * Features: Countdown, Auto-stop, and 5-second Idle Pause
 */
export const useTimer = () => {
  const { 
    isActive, 
    timeLeft, 
    tick, 
    endTest, 
    isFinished 
  } = useTypingStore();
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isFinished) {
      interval = setInterval(() => {
        if (timeLeft <= 1) {
          endTest();
          if (interval) clearInterval(interval);
        } else {
          tick();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isFinished, timeLeft, tick, endTest]);

  // Keep an empty function for backwards compatibility with components that call it
  const resetIdleTimer = () => {};

  return {
    isIdle: false,
    resetIdleTimer
  };
};

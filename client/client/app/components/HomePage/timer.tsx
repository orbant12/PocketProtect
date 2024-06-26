import { useCallback, useEffect, useRef, useState } from 'react';

export const useTimer = (
  initialSeconds: number,
  onTimerFinished: () => void,
) => {
  const [counter, setCounter] = useState(initialSeconds);
  const [displayCounter, setDisplayCounter] = useState('');

  const timerRef = useRef<number | undefined>();

  const updateCounter = useCallback(() => {
    setCounter((prevCounter) => {
      if (prevCounter <= 0) {
        clearInterval(timerRef.current!);
        onTimerFinished?.();
        return 0;
      }
      return prevCounter - 1;
    });
  }, [onTimerFinished]);

  useEffect(() => {
    setCounter(initialSeconds); // Reset the counter when initialSeconds changes
  }, [initialSeconds]);

  useEffect(() => {
    const tick = () => {
      updateCounter();
    };

    if (counter > 0) {
      timerRef.current = setInterval(tick, 1000);
      return () => clearInterval(timerRef.current!);
    } else {
      clearInterval(timerRef.current!);
    }
  }, [counter, updateCounter]);

  useEffect(() => {
    const hours = Math.floor(counter / 3600);
    const minutes = Math.floor((counter % 3600) / 60);
    const seconds = counter % 60;
    
    if (hours > 0) {
      setDisplayCounter(
        `${hours} h •${hours !== 1 ? '' : 's'} ${minutes} m •${minutes !== 1 ? '' : 's'} ${seconds} s${seconds !== 1 ? '' : 's'}`
      );
    } else if (minutes > 0) {
      setDisplayCounter(
        `${minutes} m${minutes !== 1 ? '' : 's'} ${seconds} s${seconds !== 1 ? '' : 's'}`
      );
    } else {
      setDisplayCounter(
        `${seconds} s${seconds !== 1 ? '' : 's'}`
      );
    }
  }, [counter]);

  return displayCounter;
};

import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useLocalStorage } from './useLocalStorage';

interface DailyUsage {
  [key: string]: number; // YYYY-MM-DD: seconds
}

export function useTimeTracker() {
  const [dailyUsage, setDailyUsage] = useLocalStorage<DailyUsage>('dailyUsage', {});
  const [isActive, setIsActive] = useState(true);
  const [todayUsage, setTodayUsage] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const today = moment().format('YYYY-MM-DD');

  useEffect(() => {
    // Initialize today's usage
    setTodayUsage(dailyUsage[today] || 0);
  }, [dailyUsage, today]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsActive(isVisible);

      if (isVisible) {
        startTimeRef.current = Date.now();
      } else {
        // Save accumulated time when tab becomes inactive
        if (startTimeRef.current) {
          const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
          updateTodayUsage(sessionTime);
        }
      }
    };

    const handleFocus = () => {
      setIsActive(true);
      startTimeRef.current = Date.now();
    };

    const handleBlur = () => {
      setIsActive(false);
      if (startTimeRef.current) {
        const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        updateTodayUsage(sessionTime);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentSessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTodayUsage((dailyUsage[today] || 0) + currentSessionTime);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, dailyUsage, today]);

  const updateTodayUsage = (additionalSeconds: number) => {
    setDailyUsage(prev => ({
      ...prev,
      [today]: (prev[today] || 0) + additionalSeconds
    }));
  };

  const getWeeklyData = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const usage = dailyUsage[date] || 0;
      weekData.push({
        date,
        displayDate: moment(date).format('MMM DD'),
        dayName: moment(date).format('ddd'),
        usage,
        minutes: Math.floor(usage / 60),
        seconds: usage % 60
      });
    }
    return weekData;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return {
    todayUsage,
    isActive,
    getWeeklyData,
    formatTime,
    dailyUsage
  };
}
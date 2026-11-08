import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  
  const sortedDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
  
  let streak = 0;
  let current = new Date(sortedDates[0]);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const d = new Date(sortedDates[i]);
    const diff = (current - d) / (1000 * 60 * 60 * 24);
    if (diff <= 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }
  return streak;
}

// Spaced Repetition Logic (Custom intervals: 1, 3, 5, 15, 30 days)
export const LEVELS = [1, 3, 5, 15, 30];

export function getNextRevisionDate(level, startDate = new Date()) {
  const days = LEVELS[Math.min(level, LEVELS.length - 1)];
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function getAllFutureDates(startDate, currentLevel) {
  const baseDate = new Date(startDate || new Date());
  return LEVELS.slice(currentLevel).map(days => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  });
}

export function isRevisionDue(dateString) {
  if (!dateString) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const revisionDate = new Date(dateString);
  revisionDate.setHours(0, 0, 0, 0);
  return today >= revisionDate;
}

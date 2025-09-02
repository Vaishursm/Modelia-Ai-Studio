
import { Generation } from '../types';
import { MAX_HISTORY_ITEMS } from '../constants';

const HISTORY_KEY = 'generationHistory';

export const saveHistory = (history: Generation[]): void => {
  try {
    const historyToSave = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyToSave));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
};

export const loadHistory = (): Generation[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error("Failed to load history from localStorage:", error);
  }
  return [];
};

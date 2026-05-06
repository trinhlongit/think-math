import { useState, useEffect } from 'react';
import type { Category } from '../lib/questionGenerator';

export interface CategoryStats {
  correct: number;
  total: number;
}

export interface GameSession {
  date: string;
  score: number;
  category: Category;
  correctCount: number;
  totalCount: number;
}

export interface ProgressData {
  xp: number;
  longestStreak: number;
  gamesPlayed: number;
  categories: Record<Category, CategoryStats>;
  history: GameSession[];
}

const DEFAULT_PROGRESS: ProgressData = {
  xp: 0,
  longestStreak: 0,
  gamesPlayed: 0,
  categories: {
    calculation: { correct: 0, total: 0 },
    bonds: { correct: 0, total: 0 },
    patterns: { correct: 0, total: 0 },
    word_problems: { correct: 0, total: 0 },
    geometry: { correct: 0, total: 0 },
    time: { correct: 0, total: 0 },
  },
  history: [],
};

const STORAGE_KEY = 'mathkids_progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure new categories are present
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          categories: {
            ...DEFAULT_PROGRESS.categories,
            ...(parsed.categories || {})
          }
        };
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [progress]);

  const recordGame = (session: { category: Category; score: number; correctCount: number; totalCount: number; maxStreak: number }) => {
    setProgress((prev) => {
      const newHistory = [
        ...prev.history,
        {
          date: new Date().toISOString(),
          score: session.score,
          category: session.category,
          correctCount: session.correctCount,
          totalCount: session.totalCount,
        }
      ].slice(-20); // Keep last 20 games

      const catStats = prev.categories[session.category] || { correct: 0, total: 0 };

      return {
        ...prev,
        xp: prev.xp + session.score,
        longestStreak: Math.max(prev.longestStreak, session.maxStreak),
        gamesPlayed: prev.gamesPlayed + 1,
        categories: {
          ...prev.categories,
          [session.category]: {
            correct: catStats.correct + session.correctCount,
            total: catStats.total + session.totalCount,
          }
        },
        history: newHistory,
      };
    });
  };

  return { progress, recordGame };
}

// lib/context/CourseContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CourseProgress, ModuleStatus } from '../types/course';

interface CourseContextType {
  progress: CourseProgress;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  updateProgress: (moduleId: number, status: ModuleStatus) => void;
  navigateToModule: (moduleId: number) => void;
  canAccessModule: (moduleId: number) => boolean;
  getCurrentModule: () => number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<CourseProgress>({
    currentModule: 1,
    moduleStatus: {},
    totalScore: 0,
  });

  const [score, setScore] = useState<number>(0);

  const updateProgress = useCallback(
    (moduleId: number, status: ModuleStatus) => {
      setProgress((prev) => {
        const newModuleStatus = {
          ...prev.moduleStatus,
          [moduleId]: status,
        };

        return {
          ...prev,
          moduleStatus: newModuleStatus,
          totalScore: score, // Usar el score actualizado
        };
      });
    },
    [score]
  );

  const canAccessModule = useCallback(
    (moduleId: number) => {
      if (moduleId === 1) return true;

      const previousModule = progress.moduleStatus[moduleId - 1];
      return previousModule?.completed ?? false;
    },
    [progress.moduleStatus]
  );

  const navigateToModule = useCallback(
    (moduleId: number) => {
      if (canAccessModule(moduleId)) {
        console.log(`Navegando al módulo ${moduleId}`); // Para debugging
        setProgress((prev) => ({
          ...prev,
          currentModule: moduleId,
        }));
      } else {
        console.log(`No se puede acceder al módulo ${moduleId}`); // Para debugging
      }
    },
    [canAccessModule]
  );

  const getCurrentModule = useCallback(() => {
    return progress.currentModule;
  }, [progress.currentModule]);

  const value = {
    progress,
    score,
    setScore,
    updateProgress,
    navigateToModule,
    canAccessModule,
    getCurrentModule,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (undefined === context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
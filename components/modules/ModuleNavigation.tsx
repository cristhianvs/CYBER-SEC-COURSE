// components/modules/ModuleNavigation.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCourse } from '@/lib/context/CourseContext';

interface ModuleNavigationProps {
  currentModule: number;
  totalModules: number;
  onNext: () => void;
  onPrevious: () => void;
  isCompleted: boolean;
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({
  currentModule,
  totalModules,
  onNext,
  onPrevious,
  isCompleted
}) => {
  const { navigateToModule } = useCourse();

  const handleNextClick = () => {
    if (isCompleted && currentModule < totalModules) {
      // Si el módulo está completo y hay más módulos, navegar al siguiente
      navigateToModule(currentModule + 1);
    } else {
      // Si no está completo, continuar con el siguiente paso del módulo actual
      onNext();
    }
  };

  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentModule === 1}
      >
        Anterior
      </Button>
      {(currentModule < totalModules || !isCompleted) && (
        <Button
          onClick={handleNextClick}
        >
          {isCompleted ? 'Siguiente Módulo' : 'Siguiente'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ModuleNavigation;
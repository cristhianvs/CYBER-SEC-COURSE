// components/course/Course.tsx
"use client";

import React from 'react';
import PasswordModule from '../modules/PasswordModule';
import PhishingModule from '../modules/PhishingModule';
import { useCourse } from '@/lib/context/CourseContext';

export const Course: React.FC = () => {
  const { progress } = useCourse();

  const renderCurrentModule = () => {
    switch (progress.currentModule) {
      case 1:
        return <PasswordModule />;
      case 2:
        return <PhishingModule />;
      default:
        return <div>Módulo no encontrado</div>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {renderCurrentModule()}
    </div>
  );
};

export default Course;
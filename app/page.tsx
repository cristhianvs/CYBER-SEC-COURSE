// app/page.tsx
"use client";

import { CourseProvider } from '@/lib/context/CourseContext';
import Course from '@/components/course/Course';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CourseProvider>
        <Course />
      </CourseProvider>
    </main>
  );
}
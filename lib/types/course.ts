// lib/types/course.ts

// Define el estado de un módulo individual
export interface ModuleStatus {
    completed: boolean;
    score: number;
  }
  
  // Define el progreso general del curso
  export interface CourseProgress {
    currentModule: number;
    moduleStatus: {
      [key: number]: ModuleStatus;
    };
    totalScore: number;
  }
  
  // Define la configuración de un módulo
  export interface ModuleConfig {
    id: number;
    title: string;
    description: string;
    requiredScore: number;
  }
  
  // Define los módulos disponibles en el curso
  export const COURSE_MODULES: ModuleConfig[] = [
    {
      id: 1,
      title: "Guardianes de las Contraseñas",
      description: "Aprende a crear y gestionar contraseñas seguras",
      requiredScore: 70
    },
    {
      id: 2,
      title: "Detectives del Phishing",
      description: "Identifica y protégete contra ataques de phishing",
      requiredScore: 70
    },
    {
      id: 3,
      title: "Resistencia Contra el Malware",
      description: "Reconoce y previene infecciones por malware",
      requiredScore: 70
    }
  ];
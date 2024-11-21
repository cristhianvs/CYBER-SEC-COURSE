"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Award, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useCourse } from '@/lib/context/CourseContext';
import { ModuleNavigation } from './ModuleNavigation';

// Mantener las interfaces existentes
interface StepProps {
  title: string;
  content: React.ReactNode;
}

interface InfoCardProps {
  icon?: React.ReactNode;
  title: string;
  content: string;
}

interface PasswordOption {
  password: string;
  security: 'débil' | 'moderada' | 'fuerte';
}

interface ChoosePasswordStepProps {
  onFeedback: (isPositive: boolean, security: string) => void;
}

interface PasswordTipsStepProps {
  showPassword: boolean;
  toggleShowPassword: () => void;
  onPasswordChange: (password: string) => void;
}

interface PasswordSharingStepProps {
  onFeedback: (isPositive: boolean) => void;
}

// Mantener los componentes existentes (Step, InfoCard, IntroductionStep, etc.)
const Step: React.FC<StepProps> = ({ title, content }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {content}
  </div>
);

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, content }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    {icon}
    <h4 className="font-bold">{title}</h4>
    <p className="text-sm">{content}</p>
  </div>
);

const IntroductionStep: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-blue-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Los Guardianes de la Seguridad</h3>
      <p className="text-gray-700">
        Bienvenido, Guardián. Tu misión es proteger la fortaleza digital de la empresa
        contra intrusos cibernéticos. Para lograrlo, deberás aprender a crear
        contraseñas seguras que mantengan a salvo nuestra información.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <InfoCard
        icon={<Shield className="w-8 h-8 text-blue-500 mb-2" />}
        title="¿Sabías que?"
        content="El 80% de las violaciones de datos se deben a contraseñas débiles"
      />
      <InfoCard
        icon={<Lock className="w-8 h-8 text-blue-500 mb-2" />}
        title="Tu Misión"
        content="Aprende a crear contraseñas que protejan efectivamente nuestros datos"
      />
    </div>
  </div>
);

const ChoosePasswordStep: React.FC<ChoosePasswordStepProps> = ({ onFeedback }) => {
  const passwords: PasswordOption[] = [
    { password: "123456", security: "débil" },
    { password: "Password123", security: "moderada" },
    { password: "K9$mP2#vL9@nX", security: "fuerte" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-700 mb-4">
        Como Guardián, debes identificar la contraseña más segura. Analiza las siguientes opciones:
      </p>
      <div className="space-y-2">
        {passwords.map((option, index) => (
          <Button
            key={index}
            className="w-full justify-start text-left p-4"
            variant="outline"
            onClick={() => onFeedback(option.security === "fuerte", option.security)}
          >
            {option.password}
          </Button>
        ))}
      </div>
    </div>
  );
};

const PasswordTipsStep: React.FC<PasswordTipsStepProps> = ({
  showPassword,
  toggleShowPassword,
  onPasswordChange,
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <InfoCard title="Longitud" content="Mínimo 12 caracteres" />
      <InfoCard title="Complejidad" content="Combina mayúsculas y minúsculas" />
      <InfoCard title="Caracteres Especiales" content="Incluye símbolos y números" />
      <InfoCard title="Datos Personales" content="Evita información personal" />
    </div>
    <div className="mt-4 relative">
      <input
        type={showPassword ? "text" : "password"}
        className="w-full p-2 border rounded pr-10"
        placeholder="Crea tu contraseña segura"
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        onClick={toggleShowPassword}
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

const PasswordSharingStep: React.FC<PasswordSharingStepProps> = ({ onFeedback }) => {
  const options = [
    { text: 'En un post-it pegado en tu monitor', isCorrect: false },
    { text: 'Compartirla con tu supervisor por si la necesitas', isCorrect: false },
    { text: 'Guardarla en un gestor de contraseñas seguro', isCorrect: true },
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-700 mb-4">
        Las contraseñas son de uso individual y no deben compartirse bajo ninguna circunstancia. ¿Dónde debes guardar tu contraseña?
      </p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <Button
            key={index}
            className="w-full justify-start text-left p-4"
            variant="outline"
            onClick={() => onFeedback(option.isCorrect)}
          >
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

interface Step {
  title: string;
  content: React.ReactNode;
}

const PasswordModule: React.FC = () => {
  // Agregar el hook del contexto del curso
  const { updateProgress, score, setScore } = useCourse();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackIsPositive, setFeedbackIsPositive] = useState<boolean>(true);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModuleCompleted, setIsModuleCompleted] = useState<boolean>(false);
  const [pointsAwarded, setPointsAwarded] = useState<{ [key: string]: boolean }>({});
  // Añadir nuevo estado
  const [currentStepAnswered, setCurrentStepAnswered] = useState<boolean>(false);


  const steps: Step[] = [
    {
      title: "Introducción",
      content: <IntroductionStep />,
    },
    {
      title: "Elige la Contraseña Segura",
      content: (
        <ChoosePasswordStep
          onFeedback={(isPositive, security) => {
            setShowFeedback(true);
            if (isPositive && !pointsAwarded['choose_password']) {
              setScore(score + 10);
              setPointsAwarded({ ...pointsAwarded, choose_password: true });
              setFeedbackMessage(
                "¡Excelente elección! Esta contraseña combina longitud, caracteres especiales y complejidad."
              );
              setFeedbackIsPositive(true);
              // Añadir esta línea
              setCurrentStepAnswered(true);
            } else {
              setFeedbackMessage(
                "Esta contraseña no es lo suficientemente segura. Intenta con una que combine más elementos."
              );
              setFeedbackIsPositive(false);
              // Añadir esta línea también para marcar como respondido aunque sea incorrecto
              setCurrentStepAnswered(true);
            }
          }}
        />
      ),
    },
    {
      title: "Consejos para Contraseñas Seguras",
      content: (
        <PasswordTipsStep
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          onPasswordChange={(password) => {
            let strength = 0;
            if (password.length >= 12) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[!@#$%^&*]/.test(password)) strength++;

            setPasswordStrength(strength);
            setFeedbackMessage(
              strength === 4
                ? "¡Excelente contraseña!"
                : strength === 3
                ? "Buena contraseña, pero puede mejorar"
                : "Tu contraseña necesita más elementos de seguridad"
            );
            setFeedbackIsPositive(strength >= 3);
            setShowFeedback(true);

            if (strength >= 3 && !pointsAwarded['password_tips']) {
              setScore(score + 20);
              setPointsAwarded({ ...pointsAwarded, password_tips: true });
              // Añadir esta línea
              setCurrentStepAnswered(true);
            }
          }}
        />
      ),
    },
    {
      title: "No Compartas tu Contraseña",
      content: (
        <PasswordSharingStep
          onFeedback={(isPositive) => {
            setShowFeedback(true);
            if (isPositive && !pointsAwarded['password_sharing']) {
              setScore(score + 20);
              setPointsAwarded({ ...pointsAwarded, password_sharing: true });
              setFeedbackMessage(
                "¡Correcto! Las contraseñas deben guardarse en un gestor de contraseñas seguro y nunca compartirse."
              );
              setFeedbackIsPositive(true);
              // Añadir esta línea
              setCurrentStepAnswered(true);
            } else {
              setFeedbackMessage(
                "Esa no es la mejor opción. Recuerda que las contraseñas son personales y no deben compartirse."
              );
              setFeedbackIsPositive(false);
              // Añadir esta línea también
              setCurrentStepAnswered(true);
            }
          }}
        />
      ),
    },
  ];
  // Añadir este useEffect junto a los otros
  useEffect(() => {
    setCurrentStepAnswered(currentStep === 0); // La introducción siempre está "respondida"
  }, [currentStep]);

  // Reiniciar estados al cambiar de paso
  useEffect(() => {
    setShowFeedback(false);
    setFeedbackMessage('');
    setFeedbackIsPositive(true);
    setPasswordStrength(0);
  }, [currentStep]);

  // Verificar la finalización del módulo
  useEffect(() => {
    const isCompleted =
      currentStep === steps.length - 1 &&
      pointsAwarded['choose_password'] &&
      pointsAwarded['password_tips'] &&
      pointsAwarded['password_sharing'];
    setIsModuleCompleted(isCompleted);

    if (isCompleted) {
      updateProgress(1, { completed: true, score: score });
    }
  }, [currentStep, pointsAwarded, score, updateProgress]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Módulo 1: Guardianes de las Contraseñas</CardTitle>
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-yellow-500" />
            <span className="font-bold">{score} puntos</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 ${
                index === currentStep
                  ? 'bg-blue-500'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              } ${index > 0 ? 'ml-1' : ''}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Step title={steps[currentStep].title} content={steps[currentStep].content} />
        {showFeedback && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              feedbackIsPositive ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {feedbackMessage}
          </div>
        )}
        <ModuleNavigation
          currentModule={1}
          totalModules={3}
          onNext={() => {
            if (currentStep < steps.length - 1 && currentStepAnswered) {
              setCurrentStep(currentStep + 1);
            }
          }}
          onPrevious={() => {
            setCurrentStep(Math.max(0, currentStep - 1));
          }}
          isCompleted={isModuleCompleted}
          currentStepAnswered={currentStepAnswered}
        />
      </CardContent>
    </Card>
  );
};

export default PasswordModule;
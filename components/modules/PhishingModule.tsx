"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Mail, 
  AlertTriangle, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useCourse } from '@/lib/context/CourseContext';
import { ModuleNavigation } from './ModuleNavigation';

interface StepProps {
  title: string;
  content: React.ReactNode;
}

interface InfoCardProps {
  icon?: React.ReactNode;
  title: string;
  content: string;
}

interface EmailExample {
  id: number;
  sender: string;
  subject: string;
  content: string;
  isPhishing: boolean;
  suspiciousElements: string[];
}

interface PhishingEmailProps {
  email: EmailExample;
  onDecision: (decision: boolean) => void;
}

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
  <div className="space-y-6">
    <div className="bg-blue-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Detectives del Phishing</h3>
      <p className="text-gray-700">
        ¡Bienvenido, Detective Digital! Tu nueva misión es proteger a la empresa de 
        ataques de phishing. Deberás analizar mensajes sospechosos y detectar amenazas 
        antes de que sea tarde.
      </p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Mail className="w-8 h-8 text-blue-500 mr-2" />
        <h4 className="text-xl font-bold">¿Qué es el Phishing?</h4>
      </div>
      <div className="space-y-4">
        <p className="text-gray-700">
          Imagina que un pescador lanza su anzuelo al agua esperando que algún pez lo muerda. 
          El phishing funciona de manera similar, pero en el mundo digital:
        </p>
        <div className="pl-4 border-l-4 border-blue-200">
          <p className="text-gray-700">
            Es un tipo de ataque donde los ciberdelincuentes "pescan" información confidencial 
            haciéndose pasar por empresas o personas de confianza.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-bold mb-2">¿Cómo funciona?</h5>
          <ul className="list-disc pl-5 space-y-2">
            <li>Envían mensajes que parecen legítimos (el "anzuelo")</li>
            <li>Suelen crear una sensación de urgencia</li>
            <li>Piden que hagas clic en enlaces o descargues archivos</li>
            <li>Buscan robar contraseñas, datos bancarios o información personal</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <InfoCard
        icon={<AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />}
        title="¿Sabías que?"
        content="El 90% de las brechas de seguridad comienzan con un ataque de phishing"
      />
      <InfoCard
        icon={<Mail className="w-8 h-8 text-blue-500 mb-2" />}
        title="Tu Misión"
        content="Aprende a identificar y reportar correos fraudulentos"
      />
    </div>
  </div>
);

const PhishingEmail: React.FC<PhishingEmailProps> = ({ email, onDecision }) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="border-b pb-2 mb-2">
      <p><strong>De:</strong> {email.sender}</p>
      <p><strong>Asunto:</strong> {email.subject}</p>
    </div>
    <div className="mb-4">
      <p>{email.content}</p>
    </div>
    <div className="flex space-x-4">
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => onDecision(false)}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Seguro
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => onDecision(true)}
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        Sospechoso
      </Button>
    </div>
  </div>
);

const DetectionStep: React.FC<{ 
  onScore: (points: number, actionKey: string) => void; 
  onAnswered: () => void; 
}> = ({ onScore, onAnswered }) => {
  const [currentEmail, setCurrentEmail] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [hasCompletedAllEmails, setHasCompletedAllEmails] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<{ [key: string]: boolean }>({});

  const emails: EmailExample[] = [
    {
      id: 1,
      sender: "soporte@banc0.com",
      subject: "¡URGENTE! Verificación de cuenta necesaria",
      content: "Estimado cliente, hemos detectado actividad sospechosa en su cuenta. Haga clic aquí para verificar su identidad inmediatamente.",
      isPhishing: true,
      suspiciousElements: ["Dominio incorrecto", "Sentido de urgencia", "Enlaces sospechosos"]
    },
    {
      id: 2,
      sender: "rh@empresa.com",
      subject: "Actualización de datos del personal",
      content: "Por favor actualiza tus datos personales en el portal de empleados siguiendo los procedimientos habituales.",
      isPhishing: false,
      suspiciousElements: []
    }
  ];

  useEffect(() => {
    // Cuando se completan todos los correos, notificamos que el paso está completado
    if (hasCompletedAllEmails) {
      console.log('Todos los correos completados, notificando...'); // Debug
      onAnswered();
    }
  }, [hasCompletedAllEmails, onAnswered]);

  const handleDecision = (isPhishingGuess: boolean) => {
    const email = emails[currentEmail];
    const correct = isPhishingGuess === email.isPhishing;
    
    if (correct && !pointsAwarded[`email_${email.id}`]) {
      setFeedback(
        `¡Correcto! ${
          email.isPhishing
            ? `Elementos sospechosos: ${email.suspiciousElements.join(", ")}`
            : "Este es un correo legítimo."
        }`
      );
      setFeedbackType('success');
      onScore(10, `email_${email.id}`);
      setPointsAwarded(prev => ({ ...prev, [`email_${email.id}`]: true }));
    } else {
      setFeedback(
        `Incorrecto. ${
          email.isPhishing
            ? `Este era un correo fraudulento. Elementos sospechosos: ${email.suspiciousElements.join(", ")}`
            : "Este era un correo legítimo."
        }`
      );
      setFeedbackType('error');
    }

    setTimeout(() => {
      if (currentEmail < emails.length - 1) {
        setCurrentEmail(currentEmail + 1);
        setFeedback('');
        setFeedbackType(null);
      } else {
        console.log('Último correo completado, marcando como completado...'); // Debug
        setHasCompletedAllEmails(true);
      }
    }, 2000);
  };

  if (hasCompletedAllEmails) {
    return (
      <div className="text-center p-6">
        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="font-bold text-xl mb-2">¡Excelente trabajo!</h3>
        <p>Has completado todos los ejercicios de detección</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-700 mb-4">
        Analiza los siguientes correos y decide si son seguros o sospechosos:
      </p>
      <PhishingEmail 
        email={emails[currentEmail]} 
        onDecision={handleDecision}
      />
      {feedbackType && (
        <div className={`p-4 rounded-lg ${
          feedbackType === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

const PhishingTipsStep: React.FC = () => {
  const tips = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      title: "Verificar Remitente",
      content: "Comprueba siempre la dirección de correo del remitente"
    },
    {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      title: "No Hacer Clic",
      content: "Nunca hagas clic en enlaces sospechosos"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Reportar",
      content: "Reporta inmediatamente cualquier correo sospechoso a IT"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {tips.map((tip, index) => (
        <InfoCard
          key={index}
          icon={tip.icon}
          title={tip.title}
          content={tip.content}
        />
      ))}
    </div>
  );
};

const FinalQuizStep: React.FC<{ 
  onScore: (points: number, actionKey: string) => void;
  onAnswered: () => void;
}> = ({ onScore, onAnswered }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<{ [key: string]: boolean }>({});

  const questions = [
    {
      question: "¿Cuál es la mejor acción ante un correo sospechoso?",
      options: [
        "Abrirlo para investigar",
        "Reportarlo a IT inmediatamente",
        "Reenviarlo a compañeros",
        "Ignorarlo"
      ],
      correct: 1
    }
  ];

  // Efecto para marcar como respondido cuando se muestran los resultados
  useEffect(() => {
    if (showResults) {
      onAnswered();
    }
  }, [showResults, onAnswered]);

  const handleAnswer = (selectedOption: number) => {
    const question = questions[currentQuestion];
    const actionKey = `question_${currentQuestion}`;

    if (selectedOption === question.correct && !pointsAwarded[actionKey]) {
      onScore(20, actionKey);
      setPointsAwarded({ ...pointsAwarded, [actionKey]: true });
    }
    onAnswered(); // Marcar como respondido

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="space-y-4">
      {!showResults ? (
        <>
          <h3 className="font-bold mb-4">{questions[currentQuestion].question}</h3>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-2">¡Felicitaciones!</h3>
          <p>Has completado el módulo de Detectives del Phishing</p>
        </div>
      )}
    </div>
  );
};

const PhishingModule: React.FC = () => {
  const { updateProgress, score, setScore } = useCourse();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isModuleCompleted, setIsModuleCompleted] = useState<boolean>(false);
  const [pointsAwarded, setPointsAwarded] = useState<{ [key: string]: boolean }>({});
  const [currentStepAnswered, setCurrentStepAnswered] = useState<boolean>(false);

  const handleScore = (points: number, actionKey: string) => {
    if (!pointsAwarded[actionKey]) {
      setScore(score + points);
      setPointsAwarded({ ...pointsAwarded, [actionKey]: true });
    }
  };

  // Manejador específico para marcar un paso como respondido
  const handleStepAnswered = () => {
    console.log('Paso marcado como respondido'); // Debug
    setCurrentStepAnswered(true);
  };

  const steps = [
    {
      title: "Introducción",
      content: <IntroductionStep />,
      isInformative: true
    },
    {
      title: "Detecta el Phishing",
      content: (
        <DetectionStep 
          onScore={handleScore} 
          onAnswered={handleStepAnswered}
        />
      )
    },
    {
      title: "Consejos de Seguridad",
      content: <PhishingTipsStep />,
      isInformative: true
    },
    {
      title: "Evaluación Final",
      content: (
        <FinalQuizStep 
          onScore={handleScore}
          onAnswered={handleStepAnswered}
        />
      )
    },
  ];

  // Efecto para manejar secciones informativas
  useEffect(() => {
    if (steps[currentStep].isInformative) {
      console.log('Sección informativa marcada como respondida'); // Debug
      setCurrentStepAnswered(true);
    } else {
      setCurrentStepAnswered(false);
    }
  }, [currentStep]);

  // Efecto para verificar la finalización del módulo
  useEffect(() => {
    const isCompleted =
      currentStep === steps.length - 1 &&
      Object.keys(pointsAwarded).length >= 2;

    setIsModuleCompleted(isCompleted);

    if (isCompleted) {
      updateProgress(2, { completed: true, score: score });
    }
  }, [currentStep, pointsAwarded, score, updateProgress]);

  // Manejador para el botón siguiente
  const handleNext = () => {
    console.log('Intentando avanzar al siguiente paso'); // Debug
    console.log('Estado actual:', { currentStep, currentStepAnswered, isModuleCompleted }); // Debug
    
    if (currentStepAnswered) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setCurrentStepAnswered(false);
      }
    }
  };

  // Manejador para el botón anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Módulo 2: Detectives del Phishing</CardTitle>
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
        <Step 
          title={steps[currentStep].title} 
          content={steps[currentStep].content}
        />
        <ModuleNavigation
          currentModule={2}
          totalModules={3}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isCompleted={isModuleCompleted}
          currentStepAnswered={currentStepAnswered}
        />
      </CardContent>
    </Card>
  );
};

export default PhishingModule;
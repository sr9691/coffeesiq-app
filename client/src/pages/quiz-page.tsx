import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/layout/navbar';

// Question types
type AnswerOption = {
  id: string;
  text: string;
  value: string;
  icon?: string;
};

type Question = {
  id: string;
  question: string;
  description?: string;
  answerType: 'single' | 'multiple';
  options: AnswerOption[];
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { 
    opacity: 0,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

// Quiz questions
const quizQuestions: Question[] = [
  {
    id: 'roast-level',
    question: 'What roast level do you prefer?',
    description: 'Roast levels affect the flavor, acidity, and body of coffee.',
    answerType: 'single',
    options: [
      { id: 'light', text: 'Light Roast', value: 'light', icon: '☀️' },
      { id: 'medium', text: 'Medium Roast', value: 'medium', icon: '🌤️' },
      { id: 'medium-dark', text: 'Medium-Dark Roast', value: 'medium-dark', icon: '⛅' },
      { id: 'dark', text: 'Dark Roast', value: 'dark', icon: '🌙' },
    ],
  },
  {
    id: 'flavor-profile',
    question: 'What flavor notes do you enjoy?',
    description: 'Select all that apply.',
    answerType: 'multiple',
    options: [
      { id: 'fruity', text: 'Fruity', value: 'fruity', icon: '🍎' },
      { id: 'nutty', text: 'Nutty', value: 'nutty', icon: '🥜' },
      { id: 'chocolate', text: 'Chocolate', value: 'chocolate', icon: '🍫' },
      { id: 'caramel', text: 'Caramel', value: 'caramel', icon: '🍯' },
      { id: 'floral', text: 'Floral', value: 'floral', icon: '🌸' },
      { id: 'spicy', text: 'Spicy', value: 'spicy', icon: '🌶️' },
    ],
  },
  {
    id: 'acidity',
    question: 'How do you feel about acidity?',
    description: 'Acidity contributes to the brightness and liveliness of coffee.',
    answerType: 'single',
    options: [
      { id: 'low', text: 'Low acidity', value: 'low', icon: '😌' },
      { id: 'medium', text: 'Medium acidity', value: 'medium', icon: '😊' },
      { id: 'high', text: 'High acidity', value: 'high', icon: '😃' },
    ],
  },
  {
    id: 'brew-method',
    question: 'How do you usually brew your coffee?',
    description: 'Different brewing methods highlight different characteristics.',
    answerType: 'single',
    options: [
      { id: 'drip', text: 'Drip/Pour Over', value: 'drip', icon: '☕' },
      { id: 'espresso', text: 'Espresso', value: 'espresso', icon: '💪' },
      { id: 'french-press', text: 'French Press', value: 'french-press', icon: '🧋' },
      { id: 'aeropress', text: 'AeroPress', value: 'aeropress', icon: '🥤' },
      { id: 'cold-brew', text: 'Cold Brew', value: 'cold-brew', icon: '❄️' },
    ],
  },
  {
    id: 'origin',
    question: 'Do you have a preferred coffee origin?',
    description: 'Coffee beans from different regions have distinctive characteristics.',
    answerType: 'single',
    options: [
      { id: 'latin-america', text: 'Latin America', value: 'latin-america', icon: '🌎' },
      { id: 'africa', text: 'Africa', value: 'africa', icon: '🌍' },
      { id: 'asia', text: 'Asia/Pacific', value: 'asia', icon: '🌏' },
      { id: 'no-preference', text: 'No preference', value: 'no-preference', icon: '🌐' },
    ],
  },
];

export default function QuizPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleSingleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setProgress(((currentQuestionIndex + 1) / quizQuestions.length) * 100);
      }, 500);
    }
  };

  const handleMultipleAnswer = (value: string) => {
    setAnswers(prev => {
      const currentAnswers = (prev[currentQuestion.id] || []) as string[];
      if (currentAnswers.includes(value)) {
        return {
          ...prev,
          [currentQuestion.id]: currentAnswers.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [currentQuestion.id]: [...currentAnswers, value]
        };
      }
    });
  };

  const handleNextForMultiple = () => {
    if (!answers[currentQuestion.id] || (answers[currentQuestion.id] as string[]).length === 0) {
      toast({
        title: "Please select at least one option",
        description: "You need to select at least one option to continue.",
        variant: "destructive"
      });
      return;
    }

    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setProgress(((currentQuestionIndex + 1) / quizQuestions.length) * 100);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setProgress(0);
  };

  const handleFinishQuiz = () => {
    // In a real application, we would send the quiz results to the server
    // and get personalized recommendations based on the user's answers
    
    // For now, we'll just show a toast and navigate to the discover page
    toast({
      title: "Recommendations Ready!",
      description: "We've analyzed your preferences and found some coffees you might enjoy!",
    });
    
    setLocation('/discover');
  };

  // Animated coffee bean loader
  const CoffeeBeanLoader = () => (
    <motion.div
      className="h-32 w-32 mx-auto my-12"
      animate={{
        rotate: 360,
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-coffee-brown">
        <path d="M2 8c0 3.3 2.7 6 6 6 0-3.3-2.7-6-6-6zm0 8c4.4 0 8-3.6 8-8-4.4 0-8 3.6-8 8z" />
        <path d="M22 8c0 3.3-2.7 6-6 6 0-3.3 2.7-6 6-6zm0 8c-4.4 0-8-3.6-8-8 4.4 0 8 3.6 8 8z" />
      </svg>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-coffee-light">
      <Navbar title="Coffee Preference Quiz" showBack onBack={() => setLocation('/')} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Progress value={progress} className="h-2 bg-coffee-cream" />
        </div>

        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-coffee-cream shadow-lg">
                <CardHeader className="bg-coffee-brown text-coffee-light rounded-t-lg">
                  <CardTitle className="text-xl font-serif">Your Coffee Profile</CardTitle>
                  <CardDescription className="text-coffee-light/90">
                    Based on your answers, we've crafted your perfect coffee match.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <CoffeeBeanLoader />
                    
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-coffee-brown mb-2">
                        Ready for your personalized recommendations?
                      </h3>
                      <p className="text-gray-600">
                        We'll use your preferences to suggest coffee beans that match your taste profile.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                      {Object.entries(answers).map(([questionId, answer]) => {
                        const question = quizQuestions.find(q => q.id === questionId);
                        if (!question) return null;
                        
                        return (
                          <div key={questionId} className="bg-coffee-cream/30 p-4 rounded-lg">
                            <h4 className="font-medium text-coffee-brown">{question.question}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {Array.isArray(answer) 
                                ? question.options
                                    .filter(opt => answer.includes(opt.value))
                                    .map(opt => `${opt.icon} ${opt.text}`)
                                    .join(', ')
                                : question.options
                                    .find(opt => opt.value === answer)
                                    ?.text || ''
                              }
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end bg-gray-50 rounded-b-lg p-4">
                  <Button 
                    variant="outline" 
                    onClick={handleRestart}
                    className="w-full sm:w-auto"
                  >
                    Retake Quiz
                  </Button>
                  <Button 
                    onClick={handleFinishQuiz}
                    className="w-full sm:w-auto bg-coffee-brown hover:bg-coffee-brown/90 text-coffee-light"
                  >
                    See Recommendations
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-coffee-cream shadow-lg">
                <CardHeader className="bg-coffee-brown text-coffee-light rounded-t-lg">
                  <CardTitle className="text-xl font-serif">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </CardTitle>
                  <CardDescription className="text-coffee-light/90">
                    {currentQuestion.question}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {currentQuestion.description && (
                    <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
                  )}
                  
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid gap-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <motion.div key={option.id} variants={itemVariants}>
                        <Button
                          variant={
                            currentQuestion.answerType === 'single'
                              ? answers[currentQuestion.id] === option.value
                                ? 'default'
                                : 'outline'
                              : (answers[currentQuestion.id] as string[] || []).includes(option.value)
                                ? 'default'
                                : 'outline'
                          }
                          className={`w-full justify-start text-left p-4 h-auto ${
                            currentQuestion.answerType === 'single'
                              ? answers[currentQuestion.id] === option.value
                                ? 'bg-coffee-brown text-coffee-light border-transparent'
                                : 'hover:bg-coffee-cream/20 border-coffee-cream'
                              : (answers[currentQuestion.id] as string[] || []).includes(option.value)
                                ? 'bg-coffee-brown text-coffee-light border-transparent'
                                : 'hover:bg-coffee-cream/20 border-coffee-cream'
                          }`}
                          onClick={() => 
                            currentQuestion.answerType === 'single'
                              ? handleSingleAnswer(option.value)
                              : handleMultipleAnswer(option.value)
                          }
                        >
                          <div className="flex items-center">
                            {option.icon && (
                              <span className="mr-3 text-xl" role="img" aria-label={option.text}>
                                {option.icon}
                              </span>
                            )}
                            <span>{option.text}</span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
                {currentQuestion.answerType === 'multiple' && (
                  <CardFooter className="flex justify-end bg-gray-50 rounded-b-lg p-4">
                    <Button
                      onClick={handleNextForMultiple}
                      className="bg-coffee-brown hover:bg-coffee-brown/90 text-coffee-light"
                    >
                      {isLastQuestion ? 'Finish' : 'Next'}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
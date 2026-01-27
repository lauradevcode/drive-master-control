import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Car, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw,
  Trophy,
  LogOut,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { getRandomQuestions, QuizQuestion } from "@/data/quizQuestions";
import { cn } from "@/lib/utils";

type QuizState = "intro" | "playing" | "finished";

export default function Simulado() {
  const { user, profile, isActive, signOut, loading } = useAuth();
  const navigate = useNavigate();
  
  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [confirmedAnswers, setConfirmedAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [showResult, setShowResult] = useState(false);

  // Removed login check for demo purposes

  // Timer
  useEffect(() => {
    if (quizState !== "playing" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setQuizState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const startQuiz = useCallback(() => {
    const randomQuestions = getRandomQuestions(30);
    setQuestions(randomQuestions);
    setSelectedAnswers(new Array(randomQuestions.length).fill(null));
    setConfirmedAnswers(new Array(randomQuestions.length).fill(false));
    setCurrentQuestion(0);
    setTimeLeft(60 * 60);
    setQuizState("playing");
    setShowResult(false);
  }, []);

  const selectAnswer = (answerIndex: number) => {
    if (confirmedAnswers[currentQuestion]) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const confirmAnswer = () => {
    if (selectedAnswers[currentQuestion] === null) return;
    
    const newConfirmed = [...confirmedAnswers];
    newConfirmed[currentQuestion] = true;
    setConfirmedAnswers(newConfirmed);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    setShowResult(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setShowResult(confirmedAnswers[index]);
    setCurrentQuestion(index);
  };

  const finishQuiz = () => {
    setQuizState("finished");
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSignOut = async () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AutoEscola</span>
          </Link>

          <div className="flex items-center gap-4">
            {quizState === "playing" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
                <span className={cn(
                  "font-mono font-bold",
                  timeLeft < 300 ? "text-destructive" : "text-primary"
                )}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
            <span className="text-sm text-muted-foreground hidden md:block">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Intro State */}
        {quizState === "intro" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Simulado DETRAN</CardTitle>
                <CardDescription className="text-base mt-2">
                  Teste seus conhecimentos com questões oficiais
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Regras do Simulado</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      30 questões de múltipla escolha
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      60 minutos para completar
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Precisa de 70% de acerto (21 questões) para aprovação
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Questões sobre: Legislação, Sinalização, Direção Defensiva, Primeiros Socorros e mais
                    </li>
                  </ul>
                </div>

                <Button onClick={startQuiz} size="lg" className="w-full text-lg">
                  Iniciar Simulado
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Link to="/dashboard" className="block">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playing State */}
        {quizState === "playing" && questions.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[280px_1fr] gap-6">
              {/* Question Navigator */}
              <div className="order-2 lg:order-1">
                <Card className="sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Questões</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-2">
                      {questions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToQuestion(index)}
                          className={cn(
                            "w-full aspect-square rounded-lg text-sm font-medium transition-all",
                            "hover:scale-105",
                            currentQuestion === index && "ring-2 ring-primary ring-offset-2",
                            confirmedAnswers[index]
                              ? selectedAnswers[index] === questions[index].correctAnswer
                                ? "bg-accent text-accent-foreground"
                                : "bg-destructive text-destructive-foreground"
                              : selectedAnswers[index] !== null
                                ? "bg-primary/20 text-primary"
                                : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">
                          {confirmedAnswers.filter(Boolean).length}/{questions.length}
                        </span>
                      </div>
                      <Progress 
                        value={(confirmedAnswers.filter(Boolean).length / questions.length) * 100} 
                      />
                    </div>

                    <Button 
                      onClick={finishQuiz} 
                      variant="outline" 
                      className="w-full mt-4"
                      disabled={confirmedAnswers.filter(Boolean).length < questions.length}
                    >
                      Finalizar Simulado
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Question Card */}
              <div className="order-1 lg:order-2">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {questions[currentQuestion].category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Questão {currentQuestion + 1} de {questions.length}
                      </span>
                    </div>
                    <CardTitle className="text-xl leading-relaxed">
                      {currentQuestion + 1} - {questions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => {
                      const isSelected = selectedAnswers[currentQuestion] === index;
                      const isCorrect = index === questions[currentQuestion].correctAnswer;
                      const isConfirmed = confirmedAnswers[currentQuestion];

                      return (
                        <button
                          key={index}
                          onClick={() => selectAnswer(index)}
                          disabled={isConfirmed}
                          className={cn(
                            "w-full p-4 rounded-lg text-left transition-all",
                            "border-2 flex items-start gap-3",
                            !isConfirmed && "hover:border-primary hover:bg-primary/5",
                            isSelected && !isConfirmed && "border-primary bg-primary/10",
                            isConfirmed && isCorrect && "border-accent bg-accent/10",
                            isConfirmed && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                            !isSelected && !isConfirmed && "border-border"
                          )}
                        >
                          <span className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
                            isSelected && !isConfirmed && "bg-primary text-primary-foreground",
                            isConfirmed && isCorrect && "bg-accent text-accent-foreground",
                            isConfirmed && isSelected && !isCorrect && "bg-destructive text-destructive-foreground",
                            !isSelected && !isConfirmed && "bg-muted"
                          )}>
                            {String.fromCharCode(97 + index)}
                          </span>
                          <span className="flex-1 pt-1">{option}</span>
                          {isConfirmed && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                          )}
                          {isConfirmed && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={previousQuestion}
                        disabled={currentQuestion === 0}
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Anterior
                      </Button>

                      {!confirmedAnswers[currentQuestion] ? (
                        <Button
                          onClick={confirmAnswer}
                          disabled={selectedAnswers[currentQuestion] === null}
                        >
                          Confirmar Resposta
                        </Button>
                      ) : currentQuestion < questions.length - 1 ? (
                        <Button onClick={nextQuestion}>
                          Próxima
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      ) : (
                        <Button onClick={finishQuiz}>
                          Ver Resultado
                          <Trophy className="ml-2 w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Finished State */}
        {quizState === "finished" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className={cn(
                "py-8 text-center",
                calculateScore() >= 21 
                  ? "bg-gradient-to-br from-accent/20 to-accent/5" 
                  : "bg-gradient-to-br from-destructive/20 to-destructive/5"
              )}>
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4",
                  calculateScore() >= 21 ? "bg-accent/20" : "bg-destructive/20"
                )}>
                  {calculateScore() >= 21 ? (
                    <Trophy className="w-12 h-12 text-accent" />
                  ) : (
                    <XCircle className="w-12 h-12 text-destructive" />
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {calculateScore() >= 21 ? "Parabéns!" : "Não foi dessa vez"}
                </h2>
                <p className="text-muted-foreground">
                  {calculateScore() >= 21 
                    ? "Você foi aprovado no simulado!" 
                    : "Continue estudando e tente novamente!"}
                </p>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary">
                      {calculateScore()}/{questions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Acertos</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary">
                      {Math.round((calculateScore() / questions.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Aproveitamento</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary">
                      {formatTime(3600 - timeLeft)}
                    </div>
                    <div className="text-sm text-muted-foreground">Tempo Usado</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={startQuiz} className="w-full" size="lg">
                    <RotateCcw className="mr-2 w-4 h-4" />
                    Fazer Novo Simulado
                  </Button>
                  <Link to="/dashboard" className="block">
                    <Button variant="outline" className="w-full">
                      Voltar ao Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw,
  Trophy, BookOpen, FileText, Timer, Target, Lightbulb, Layers,
} from "lucide-react";
import { getRandomQuestions, QuizQuestion } from "@/data/quizQuestions";
import { cn } from "@/lib/utils";

type QuizState = "intro" | "playing" | "finished";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Legislação de Trânsito": { bg: "bg-blue-500", text: "text-white" },
  "Sinalização de Trânsito": { bg: "bg-emerald-500", text: "text-white" },
  "Direção Defensiva": { bg: "bg-orange-500", text: "text-white" },
  "Primeiros Socorros": { bg: "bg-red-500", text: "text-white" },
  "Cidadania e Meio Ambiente": { bg: "bg-teal-500", text: "text-white" },
  "Mecânica Básica": { bg: "bg-violet-500", text: "text-white" },
  "Normas de Circulação": { bg: "bg-sky-500", text: "text-white" },
  "Infrações e Penalidades": { bg: "bg-rose-500", text: "text-white" },
  "Processo de Habilitação": { bg: "bg-indigo-500", text: "text-white" },
};

function getCategoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] || { bg: "bg-muted", text: "text-foreground" };
}

export default function Simulado() {
  const { user, isAdmin, isInstructor, loading } = useAuth();
  const navigate = useNavigate();

  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [confirmedAnswers, setConfirmedAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [showResult, setShowResult] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isAdmin) {
      toast({ title: "Simulados são exclusivos para alunos.", variant: "destructive" });
      navigate("/admin", { replace: true });
    } else if (isInstructor) {
      toast({ title: "Simulados são exclusivos para alunos.", variant: "destructive" });
      navigate("/instrutor", { replace: true });
    }
  }, [loading, isAdmin, isInstructor, navigate]);

  useEffect(() => {
    if (quizState !== "playing" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setQuizState("finished"); return 0; }
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

  const nextQuestion = () => { setShowResult(false); if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1); };
  const previousQuestion = () => { setShowResult(false); if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1); };

  const calculateScore = useCallback(() => {
    let correct = 0;
    questions.forEach((q, i) => { if (selectedAnswers[i] === q.correctAnswer) correct++; });
    return correct;
  }, [questions, selectedAnswers]);

  // Save result to Supabase
  const saveResult = useCallback(async (score: number, timeUsed: number) => {
    if (!user || saving) return;
    setSaving(true);
    try {
      const percent = Math.round((score / questions.length) * 100);
      await (supabase as any).from("simulados").insert({
        aluno_id: user.id,
        nota: percent,
        acertos: score,
        total_questoes: questions.length,
        tempo_segundos: timeUsed,
        aprovado: score >= 21,
      });
    } catch (err) {
      console.error("Failed to save simulado result:", err);
    } finally {
      setSaving(false);
    }
  }, [user, questions.length, saving]);

  const finishQuiz = () => { setQuizState("finished"); };

  // Save when quiz finishes
  useEffect(() => {
    if (quizState === "finished" && questions.length > 0) {
      const score = calculateScore();
      const timeUsed = 3600 - timeLeft;
      saveResult(score, timeUsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const timerColor = timeLeft > 20 * 60 ? "text-emerald-600" : timeLeft > 10 * 60 ? "text-yellow-600" : "text-destructive";
  const timerBlink = timeLeft <= 60 && timeLeft > 0;
  const progressPercent = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const categoryStats = useMemo(() => {
    if (questions.length === 0) return [];
    const map: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q, i) => {
      if (!map[q.category]) map[q.category] = { total: 0, correct: 0 };
      map[q.category].total++;
      if (selectedAnswers[i] === q.correctAnswer) map[q.category].correct++;
    });
    return Object.entries(map).map(([cat, data]) => ({
      category: cat, total: data.total, correct: data.correct,
      percent: Math.round((data.correct / data.total) * 100),
    }));
  }, [questions, selectedAnswers]);

  const bestCategory = useMemo(() => {
    if (categoryStats.length === 0) return null;
    return categoryStats.reduce((a, b) => (a.percent >= b.percent ? a : b));
  }, [categoryStats]);

  const letters = ["A", "B", "C", "D"];

  // ─── INTRO ────────────────────────────────────────────
  if (quizState === "intro") {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-[560px] rounded-2xl overflow-hidden shadow-xl bg-card">
          <div className="gradient-primary px-8 py-8 text-center">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground">Simulado DETRAN</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Teste seus conhecimentos com questões oficiais</p>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-accent" /><span className="text-sm font-semibold text-foreground">30 questões</span></div>
                <p className="text-xs text-muted-foreground">Múltipla escolha</p>
              </div>
              <div className="border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2"><Timer className="w-4 h-4 text-accent" /><span className="text-sm font-semibold text-foreground">60 minutos</span></div>
                <p className="text-xs text-muted-foreground">Para completar</p>
              </div>
              <div className="border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /><span className="text-sm font-semibold text-foreground">70% aprovação</span></div>
                <p className="text-xs text-muted-foreground">21 acertos mín.</p>
              </div>
              <div className="border border-border rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-violet-500" /><span className="text-sm font-semibold text-foreground">4+ categorias</span></div>
                <p className="text-xs text-muted-foreground">Legislação, Sinalização +</p>
              </div>
            </div>
            <Button onClick={startQuiz} className="w-full h-[52px] text-lg bg-accent hover:bg-accent/90 text-accent-foreground">
              Iniciar Simulado <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <button onClick={() => navigate("/dashboard")} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">← Voltar ao Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING ──────────────────────────────────────────
  if (quizState === "playing" && questions.length > 0) {
    const q = questions[currentQuestion];
    const isConfirmed = confirmedAnswers[currentQuestion];
    const allAnswered = confirmedAnswers.filter(Boolean).length === questions.length;

    return (
      <div className="min-h-screen bg-secondary flex flex-col">
        <header className="sticky top-0 z-50 bg-card shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-3 md:px-6 py-2.5 md:py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="sm" className="shrink-0 text-muted-foreground h-8 px-2 md:px-2.5 text-xs" onClick={() => setShowExitDialog(true)}>
              <ArrowLeft className="w-3.5 h-3.5 mr-0.5 md:mr-1" /><span className="hidden sm:inline">Sair</span>
            </Button>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary-foreground" /></div>
              <span className="text-sm font-bold text-foreground hidden md:block">Simulado DETRAN</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground mb-1">
                <span>{currentQuestion + 1}/{questions.length}</span><span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className={cn("flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-muted shrink-0 font-mono text-xs md:text-sm font-bold", timerColor, timerBlink && "animate-pulse")}>
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />{formatTime(timeLeft)}
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 md:px-6 pt-4 md:pt-10 pb-28">
          <div className="max-w-[720px] mx-auto">
            <span className={cn("inline-block px-3 py-1 md:px-3.5 md:py-1.5 rounded-full text-[11px] md:text-xs font-semibold mb-3 md:mb-4", getCategoryStyle(q.category).bg, getCategoryStyle(q.category).text)}>{q.category}</span>
            <p className="text-[10px] md:text-xs text-muted-foreground mb-1.5 md:mb-2">Questão {currentQuestion + 1} de {questions.length}</p>
            <h2 className="text-base md:text-lg lg:text-[22px] font-semibold leading-relaxed text-primary mb-4 md:mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                const isCorrect = index === q.correctAnswer;
                return (
                  <button key={index} onClick={() => selectAnswer(index)} disabled={isConfirmed}
                    className={cn("w-full flex items-center gap-2.5 md:gap-4 p-3.5 md:p-5 rounded-xl border-2 text-left transition-all duration-150",
                      !isConfirmed && !isSelected && "border-border bg-card hover:border-accent hover:bg-accent/5",
                      isSelected && !isConfirmed && "border-accent bg-accent/5",
                      isConfirmed && isCorrect && "border-emerald-500 bg-emerald-50",
                      isConfirmed && isSelected && !isCorrect && "border-destructive bg-red-50",
                      isConfirmed && !isSelected && !isCorrect && "border-border bg-card opacity-60",
                    )}>
                    <span className={cn("w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shrink-0 transition-all duration-150",
                      !isConfirmed && !isSelected && "bg-muted text-muted-foreground",
                      isSelected && !isConfirmed && "bg-accent text-accent-foreground",
                      isConfirmed && isCorrect && "bg-emerald-500 text-white",
                      isConfirmed && isSelected && !isCorrect && "bg-destructive text-white",
                    )}>{letters[index]}</span>
                    <span className="flex-1 text-[13px] md:text-sm lg:text-base text-foreground">{option}</span>
                    {isConfirmed && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
                    {isConfirmed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                  </button>
                );
              })}
            </div>
            {isConfirmed && (
              <div className="mt-4 flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-xl">
                <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  A resposta correta é a alternativa <strong>{letters[q.correctAnswer]}</strong>.{" "}
                  {q.category === "Primeiros Socorros" && "Lembre-se: em situações de emergência, a segurança do local e da vítima vem primeiro."}
                  {q.category === "Legislação de Trânsito" && "Consulte o Código de Trânsito Brasileiro para mais detalhes."}
                  {q.category === "Direção Defensiva" && "A direção defensiva é fundamental para prevenir acidentes."}
                  {q.category === "Sinalização de Trânsito" && "Conhecer a sinalização é essencial para a segurança no trânsito."}
                </p>
              </div>
            )}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-card shadow-[0_-2px_8px_rgba(0,0,0,0.08)] px-3 md:px-6 py-2.5 md:py-3 z-40">
          <div className="max-w-[720px] mx-auto flex items-center justify-between">
            <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0} className="h-11 md:h-10 px-3 md:px-4 text-xs md:text-sm">
              <ArrowLeft className="mr-1 w-3.5 h-3.5 md:w-4 md:h-4" /><span className="hidden sm:inline">Anterior</span><span className="sm:hidden">Ant.</span>
            </Button>
            <span className="text-xs md:text-sm text-muted-foreground">{currentQuestion + 1} / {questions.length}</span>
            {!isConfirmed ? (
              <Button onClick={confirmAnswer} disabled={selectedAnswers[currentQuestion] === null} className="h-11 md:h-10 px-3 md:px-4 text-xs md:text-sm bg-accent hover:bg-accent/90 text-accent-foreground">Confirmar</Button>
            ) : currentQuestion < questions.length - 1 ? (
              <Button onClick={nextQuestion} className="h-11 md:h-10 px-3 md:px-4 text-xs md:text-sm bg-accent hover:bg-accent/90 text-accent-foreground">
                <span className="hidden sm:inline">Próxima</span><span className="sm:hidden">Próx.</span><ArrowRight className="ml-1 w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            ) : (
              <Button onClick={finishQuiz} className="h-11 md:h-10 px-3 md:px-4 text-xs md:text-sm bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Resultado <Trophy className="ml-1.5 w-4 h-4" />
              </Button>
            )}
          </div>
          {allAnswered && currentQuestion < questions.length - 1 && (
            <div className="max-w-[720px] mx-auto mt-2">
              <button onClick={finishQuiz} className="text-xs text-accent hover:underline w-full text-center">Todas respondidas — Finalizar agora</button>
            </div>
          )}
        </div>

        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Sair do simulado?</DialogTitle>
              <DialogDescription>Seu progresso será perdido. Tem certeza que deseja sair?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowExitDialog(false)}>Continuar simulado</Button>
              <Button variant="destructive" onClick={() => navigate("/dashboard")}>Sim, sair</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─── FINISHED ─────────────────────────────────────────
  if (quizState === "finished") {
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);
    const passed = score >= 21;
    const timeUsed = 3600 - timeLeft;

    return (
      <div className="min-h-screen bg-secondary">
        <div className={cn("py-10 md:py-14 text-center", passed ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-red-600")}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-white/20">
            {passed ? <Trophy className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{passed ? "Aprovado! 🎉" : "Não foi dessa vez"}</h1>
          <p className="text-white/80 text-xs md:text-sm">Você acertou {score} de {questions.length} questões ({percent}%)</p>
          {saving && <p className="text-white/60 text-xs mt-2">Salvando resultado...</p>}
        </div>
        <div className="max-w-xl mx-auto px-4 md:px-6 -mt-6">
          <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{score}</p><p className="text-xs text-muted-foreground">Acertos</p></div>
              <div className="bg-red-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-destructive">{questions.length - score}</p><p className="text-xs text-muted-foreground">Erros</p></div>
              <div className="bg-muted rounded-xl p-4 text-center"><p className="text-2xl font-bold text-foreground">{Math.floor(timeUsed / 60)} min</p><p className="text-xs text-muted-foreground">Tempo usado</p></div>
              <div className="bg-accent/10 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-accent">{bestCategory ? `${bestCategory.percent}%` : "—"}</p><p className="text-xs text-muted-foreground truncate">{bestCategory ? bestCategory.category : "Melhor"}</p></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Desempenho por Categoria</h3>
              {categoryStats.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs"><span className="text-foreground font-medium truncate mr-2">{cat.category}</span><span className="text-muted-foreground shrink-0">{cat.percent}%</span></div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500", cat.percent >= 70 ? "bg-emerald-500" : "bg-destructive")} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-2">
              <Button onClick={startQuiz} variant="outline" className="w-full h-11 border-accent text-accent hover:bg-accent/10"><RotateCcw className="mr-2 w-4 h-4" />Tentar Novamente</Button>
              <Button onClick={() => navigate("/dashboard")} className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground">Voltar ao Dashboard</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

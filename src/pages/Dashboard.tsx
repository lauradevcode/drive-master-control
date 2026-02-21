import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Calendar,
  Trophy,
  Clock,
  Target,
  HelpCircle,
  X,
  CheckCircle2,
  ArrowRight,
  Users,
  FileText,
  PlayCircle,
} from "lucide-react";

import InternalNavbar from "@/components/InternalNavbar";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  aulasFeitas: number;
  aulasTotais: number;
  simuladosFeitos: number;
  melhorNota: number | null;
  horasEstudo: number;
}

export default function Dashboard() {
  const { user, profile, loading, isAdmin, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    aulasFeitas: 0,
    aulasTotais: 30,
    simuladosFeitos: 0,
    melhorNota: null,
    horasEstudo: 0,
  });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [visitedInstrutores, setVisitedInstrutores] = useState(() => {
    return localStorage.getItem("cnhpro_visited_instrutores") === "true";
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    try {
      const { count: solicitacoesCount } = await supabase
        .from("solicitacoes_aula")
        .select("id", { count: "exact", head: true });

      setStats({
        aulasFeitas: 0,
        aulasTotais: 30,
        simuladosFeitos: solicitacoesCount ?? 0,
        melhorNota: null,
        horasEstudo: 0,
      });
    } catch {
      console.log("Could not fetch dashboard stats");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] || null;
  const isNewUser = stats.aulasFeitas === 0 && stats.simuladosFeitos === 0;

  const onboardingSteps = [
    {
      num: 1,
      label: "Faça seu primeiro simulado",
      done: stats.simuladosFeitos > 0,
      href: "/simulado",
    },
    {
      num: 2,
      label: "Agende sua primeira aula",
      done: stats.aulasFeitas > 0,
      href: "/instrutores",
    },
    {
      num: 3,
      label: "Conheça seus instrutores",
      done: visitedInstrutores,
      href: "/instrutores",
    },
  ];
  const allStepsDone = onboardingSteps.every((s) => s.done);

  const tooltips: Record<string, string> = {
    "Aulas Concluídas":
      "Total de aulas práticas marcadas como concluídas pelo seu instrutor",
    "Simulados Feitos":
      "Quantidade de simulados completos que você realizou",
    "Melhor Nota":
      "Sua maior pontuação em um simulado. A nota mínima para aprovação no DETRAN é 70%",
    "Horas de Estudo": "Soma das horas das suas aulas concluídas",
  };

  const emptyMessages: Record<string, { text: string; href?: string }> = {
    "Aulas Concluídas": { text: "Agende sua primeira aula →", href: "/instrutores" },
    "Simulados Feitos": { text: "Comece agora →", href: "/simulado" },
    "Melhor Nota": { text: "Faça um simulado!", href: "/simulado" },
    "Horas de Estudo": { text: "Sua jornada começa aqui" },
  };

  const metricCards = [
    {
      icon: BookOpen,
      label: "Aulas Concluídas",
      value: `${stats.aulasFeitas}/${stats.aulasTotais}`,
      isEmpty: stats.aulasFeitas === 0,
      gradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      textColor: "text-blue-900",
    },
    {
      icon: Target,
      label: "Simulados Feitos",
      value: stats.simuladosFeitos.toString(),
      isEmpty: stats.simuladosFeitos === 0,
      gradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500",
      textColor: "text-emerald-900",
    },
    {
      icon: Trophy,
      label: "Melhor Nota",
      value: stats.melhorNota !== null ? `${stats.melhorNota}%` : null,
      isEmpty: stats.melhorNota === null,
      gradient: "from-violet-50 to-violet-100",
      iconBg: "bg-violet-500",
      textColor: "text-violet-900",
    },
    {
      icon: Clock,
      label: "Horas de Estudo",
      value: `${stats.horasEstudo}h`,
      isEmpty: stats.horasEstudo === 0,
      gradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      textColor: "text-orange-900",
    },
  ];

  const isViewingAsStudent = isAdmin || isInstructor;

  return (
    <div className="min-h-screen bg-secondary">
      <InternalNavbar
        navLinks={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Simulados", href: "/simulado" },
          { label: "Instrutores", href: "/instrutores" },
        ]}
      />

      {/* Admin/Instructor viewing-as-student banner */}
      {isViewingAsStudent && (
        <div className="bg-warning/10 border-b border-warning/30 px-6 py-2.5 flex items-center justify-between gap-4">
          <p className="text-sm text-warning font-medium">
            👁 Você está visualizando como Aluno.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-warning/40 text-warning hover:bg-warning/10"
                onClick={() => navigate("/admin")}
              >
                Painel Admin
              </Button>
            )}
            {isInstructor && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-warning/40 text-warning hover:bg-warning/10"
                onClick={() => navigate("/instrutor")}
              >
                Painel Instrutor
              </Button>
            )}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        {/* Page title */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {firstName ? `Olá, ${firstName} 👋` : "Olá! 👋"}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Acompanhe seu progresso e continue seus estudos
          </p>
        </div>

        {/* Onboarding banner */}
        {isNewUser && showOnboarding && !allStepsDone && (
          <div className="relative rounded-xl bg-gradient-to-r from-[#1A3C6E] to-[#2563EB] text-white p-6 md:p-8 mb-8 overflow-hidden">
            <button
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-1">
              Bem-vindo ao CNH Pro! Vamos começar? 🎉
            </h2>
            <p className="text-sm text-white/80 mb-6">
              Complete esses 3 passos para aproveitar tudo que o sistema oferece
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {onboardingSteps.map((step) => {
                const isActive = !step.done;
                return (
                  <div
                    key={step.num}
                    className={`flex items-start gap-3 rounded-lg p-4 ${
                      step.done
                        ? "bg-white/10"
                        : "bg-white/15 border border-white/20"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                        step.done
                          ? "bg-emerald-400 text-emerald-900"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step.num
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          step.done ? "line-through text-white/60" : ""
                        }`}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <button
                          onClick={() => navigate(step.href)}
                          className="text-xs font-semibold mt-2 inline-flex items-center gap-1 text-white/90 hover:text-white"
                        >
                          Fazer agora <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {metricCards.map((stat, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} border-0 shadow-sm relative`}
            >
              <CardContent className="p-3 md:p-5">
                {/* Tooltip icon */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="absolute top-3 right-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-xs">
                    {tooltips[stat.label]}
                  </TooltipContent>
                </Tooltip>

                <div
                  className={`w-8 h-8 md:w-9 md:h-9 ${stat.iconBg} rounded-lg flex items-center justify-center mb-2 md:mb-3`}
                >
                  <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>

                {/* Value or empty CTA */}
                {stat.isEmpty && stat.label === "Melhor Nota" ? (
                  <Link
                    to="/simulado"
                    className="text-lg font-bold text-accent hover:underline"
                  >
                    Faça um simulado!
                  </Link>
                ) : (
                  <p className={`text-xl md:text-3xl font-bold ${stat.textColor}`}>
                    {stat.value ?? "—"}
                  </p>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>

                {/* Motivational micro-message */}
                {stat.isEmpty && emptyMessages[stat.label] && stat.label !== "Melhor Nota" && (
                  <>
                    {emptyMessages[stat.label].href ? (
                      <Link
                        to={emptyMessages[stat.label].href!}
                        className="text-[11px] text-accent hover:underline mt-1 inline-block"
                      >
                        {emptyMessages[stat.label].text}
                      </Link>
                    ) : (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {emptyMessages[stat.label].text}
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Próxima Aula */}
        <Card className="bg-card border border-border shadow-sm mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Próxima Aula
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Nenhuma aula agendada. Agende sua primeira aula prática!
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 w-full sm:w-auto"
                onClick={() => navigate("/instrutores")}
              >
                Agendar Agora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Card 1 — Simulados */}
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow md:h-[200px]">
            <CardContent className="p-4 md:p-6 h-full flex flex-col items-center justify-between text-center gap-3 md:gap-0">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Simulados</h3>
                <p className="text-xs text-muted-foreground mt-1">Pratique com questões do DETRAN</p>
                <p className="text-xs text-muted-foreground mt-1">30 questões por simulado</p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => navigate("/simulado")}>
                Iniciar Simulado
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 — Instrutores */}
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow md:h-[200px]">
            <CardContent className="p-4 md:p-6 h-full flex flex-col items-center justify-between text-center gap-3 md:gap-0">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Instrutores</h3>
                <p className="text-xs text-muted-foreground mt-1">Encontre e agende com instrutores</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">1 instrutor disponível</p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => navigate("/instrutores")}>
                Ver Instrutores
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 — Meu Progresso */}
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow md:h-[200px]">
            <CardContent className="p-4 md:p-6 h-full flex flex-col items-center justify-between text-center gap-3 md:gap-0">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Meu Progresso</h3>
                <p className="text-xs text-muted-foreground mt-1">Acompanhe sua evolução</p>
              </div>
              <div className="w-full">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>0% concluído</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Relatório
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Materials do Curso */}
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground text-base mb-1">📚 Materiais do Curso</h3>
            <p className="text-xs text-muted-foreground mb-5">
              Conteúdos enviados pelo seu instrutor para te ajudar a estudar: PDFs, vídeos e apostilas
            </p>

            <div className="space-y-3">
              {/* Mock Card 1 - PDF */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border border-border rounded-xl">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">Apostila de Direção Defensiva</h4>
                    <p className="text-xs text-muted-foreground">Enviado por: Instrutor João · PDF · 2,4 MB</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Enviado há 2 dias</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 w-full sm:w-auto text-accent border-accent/30 hover:bg-accent/10">
                  Baixar PDF
                </Button>
              </div>

              {/* Mock Card 2 - Vídeo */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border border-border rounded-xl">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">Videoaula: Sinalização de Trânsito</h4>
                    <p className="text-xs text-muted-foreground">Enviado por: Instrutor João · Vídeo · 12 min</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Enviado há 5 dias</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 w-full sm:w-auto text-accent border-accent/30 hover:bg-accent/10">
                  Assistir
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground mt-4">
              💡 Novos materiais aparecem aqui assim que seu instrutor os enviar.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

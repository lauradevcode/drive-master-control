import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  FileText,
  BookOpen,
  BarChart3,
  Upload,
  TrendingUp,
  Calendar,
  HelpCircle,
  X,
  CheckCircle2,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MaterialsUpload from "./MaterialsUpload";
import InternalNavbar from "@/components/InternalNavbar";

interface LearningTrack {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

interface StudentProfile {
  user_id: string;
  full_name: string | null;
  updated_at: string;
}

interface Appointment {
  id: string;
  nome_aluno: string;
  melhor_horario: string | null;
  created_at: string;
  status: string;
}

const tooltips: Record<string, string> = {
  "Alunos Ativos": "Quantos alunos estão cadastrados e ativos no sistema agora.",
  "Materiais Enviados": "Arquivos que você enviou para seus alunos estudarem: PDFs, vídeos, apostilas.",
  "Trilhas Criadas": "Sequências de conteúdo que você organizou para guiar o aprendizado do aluno passo a passo.",
  "Taxa de Aprovação": "Porcentagem dos seus alunos que passaram no simulado do DETRAN com nota acima de 70%.",
};

export default function InstructorDashboard() {
  const { user, profile, isInstructor, isAdmin, loading } = useAuth();
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    if (user && (isInstructor || isAdmin)) {
      fetchTracks();
      fetchStudents();
      fetchAppointments();
      fetchMaterialsCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInstructor, isAdmin]);

  const fetchTracks = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("learning_tracks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setTracks(data as LearningTrack[]);
    } catch {
      console.log("learning_tracks table not yet available");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, updated_at")
        .order("updated_at", { ascending: false })
        .limit(4) as { data: StudentProfile[] | null };
      if (data) setStudents(data);
    } catch {
      console.log("Could not fetch students");
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!user) return;
      const { data: instrData } = await supabase
        .from("instrutores")
        .select("id")
        .eq("user_id", user.id as unknown as string)
        .limit(1);

      const instrId = instrData?.[0]?.id;
      if (!instrId) return;

      const { data } = await supabase
        .from("solicitacoes_aula")
        .select("id, nome_aluno, melhor_horario, created_at, status")
        .eq("instrutor_id", instrId)
        .eq("status", "pendente")
        .order("created_at", { ascending: false })
        .limit(3) as { data: Appointment[] | null };

      if (data) setAppointments(data);
    } catch {
      console.log("Could not fetch appointments");
    }
  };

  const fetchMaterialsCount = async () => {
    try {
      const { count } = await supabase
        .from("documentos_instrutor")
        .select("id", { count: "exact", head: true });
      if (count !== null) setMaterialsCount(count);
    } catch {
      console.log("Could not fetch materials count");
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
  const isNewInstructor = materialsCount === 0 && tracks.length === 0;

  const stats = [
    {
      label: "Alunos Ativos",
      value: students.length.toString(),
      icon: Users,
      gradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      textColor: "text-blue-900",
    },
    {
      label: "Materiais Enviados",
      value: materialsCount.toString(),
      icon: FileText,
      gradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500",
      textColor: "text-emerald-900",
    },
    {
      label: "Trilhas Criadas",
      value: tracks.length.toString(),
      icon: BookOpen,
      gradient: "from-violet-50 to-violet-100",
      iconBg: "bg-violet-500",
      textColor: "text-violet-900",
      sublabel: "(sequência de aulas)",
    },
    {
      label: "Taxa de Aprovação",
      value: "78%",
      icon: TrendingUp,
      gradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      textColor: "text-orange-900",
      sublabel: "(% de alunos aprovados no DETRAN)",
    },
  ];

  const onboardingSteps = [
    {
      num: 1,
      label: "Envie seu primeiro material",
      desc: "PDFs ou vídeos de estudo",
      done: materialsCount > 0,
      action: () => setUploadOpen(true),
    },
    {
      num: 2,
      label: "Crie uma trilha de aprendizado",
      desc: "Organize os conteúdos em ordem",
      done: tracks.length > 0,
      action: () => {},
    },
    {
      num: 3,
      label: "Acompanhe o progresso",
      desc: "Veja como seus alunos estão indo",
      done: students.length > 0,
      action: () => {},
    },
  ];
  const allStepsDone = onboardingSteps.every((s) => s.done);

  return (
    <div className="min-h-screen bg-secondary">
      <InternalNavbar
        navLinks={[
          { label: "Dashboard", href: "/instrutor" },
          { label: "Meus Alunos", href: "/instrutor/alunos" },
          { label: "Materiais", href: "/instrutor/materiais" },
          { label: "Trilhas", href: "/instrutor/trilhas" },
          { label: "Relatórios", href: "/instrutor/relatorios" },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {firstName ? `Olá, ${firstName} 👋` : "Painel do Instrutor 👋"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus alunos e conteúdos
          </p>
        </div>

        {/* Onboarding banner */}
        {isNewInstructor && showOnboarding && !allStepsDone && (
          <div className="relative rounded-xl bg-gradient-to-r from-[#1A3C6E] to-[#2563EB] text-white p-6 md:p-8 mb-8 overflow-hidden">
            <button
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-1">
              Bem-vindo ao painel do instrutor! 👋
            </h2>
            <p className="text-sm text-white/80 mb-6">
              Siga esses passos para começar a ajudar seus alunos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {onboardingSteps.map((step) => {
                const isActive = !step.done;
                return (
                  <div
                    key={step.num}
                    className={`flex items-start gap-3 rounded-xl p-4 ${
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
                      <p className="text-xs text-white/60 mt-0.5">{step.desc}</p>
                      {isActive && (
                        <button
                          onClick={step.action}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} border-0 shadow-sm relative`}
            >
              <CardContent className="p-5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="absolute top-3 right-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[220px] text-xs bg-[hsl(215,45%,12%)] text-white border-0"
                  >
                    {tooltips[stat.label]}
                  </TooltipContent>
                </Tooltip>

                <div
                  className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center mb-3`}
                >
                  <stat.icon className="w-4 h-4 text-white" />
                </div>

                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
                {stat.sublabel && (
                  <p className="text-[10px] text-muted-foreground/70">
                    {stat.sublabel}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Próximos Agendamentos */}
        <Card className="bg-card border border-border shadow-sm mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-foreground" />
              <h2 className="font-semibold text-sm text-foreground">
                Próximos Agendamentos
              </h2>
            </div>
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-3">
                Nenhuma aula agendada. Novos agendamentos aparecerão aqui.
              </p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div key={appt.id} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{appt.nome_aluno}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {appt.melhor_horario || "Horário a definir"}
                      </p>
                    </div>
                    <span className="text-xs bg-warning/10 text-warning border border-warning/20 rounded-full px-2 py-0.5 shrink-0">
                      Pendente
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Card 1 — Enviar Material */}
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow h-[200px]">
            <CardContent className="p-6 h-full flex flex-col items-center justify-between text-center">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Upload className="w-7 h-7 text-accent" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-semibold text-foreground">Enviar Material</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-muted-foreground/50 hover:text-muted-foreground">
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[220px] text-xs bg-[hsl(215,45%,12%)] text-white border-0">
                      Clique aqui para enviar um PDF ou vídeo que seus alunos poderão acessar no painel deles.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Compartilhe PDFs e vídeos com seus alunos
                </p>
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => setUploadOpen(true)}
              >
                Enviar agora
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 — Criar Trilha */}
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow h-[200px]">
            <CardContent className="p-6 h-full flex flex-col items-center justify-between text-center">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-semibold text-foreground">Criar Trilha</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-muted-foreground/50 hover:text-muted-foreground">
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[220px] text-xs bg-[hsl(215,45%,12%)] text-white border-0">
                      Uma trilha é uma sequência de materiais organizados por você. Ex: Aula 1 → Aula 2 → Simulado.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Organize aulas em sequência lógica
                </p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Criar agora
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 — Ver Relatórios */}
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow h-[200px]">
            <CardContent className="p-6 h-full flex flex-col items-center justify-between text-center">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Ver Relatórios</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Acompanhe o desempenho dos alunos
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Ver relatórios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Alunos Recentes */}
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-foreground" />
              <h2 className="font-semibold text-sm text-foreground">
                Alunos Recentes
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground">
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px] text-xs bg-[hsl(215,45%,12%)] text-white border-0">
                  Lista dos últimos alunos que acessaram o sistema. A barra mostra o progresso geral de cada um.
                </TooltipContent>
              </Tooltip>
            </div>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhum aluno encontrado.
              </p>
            ) : (
              <div className="space-y-4">
                {students.map((student, i) => {
                  const progress = [72, 45, 90, 20][i % 4];
                  const lastActivity = ["Há 2 horas", "Há 1 dia", "Há 30 min", "Há 3 dias"][i % 4];
                  return (
                    <div key={student.user_id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {student.full_name || "Aluno sem nome"}
                        </span>
                        <span className="text-xs text-muted-foreground">{lastActivity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Material</DialogTitle>
          </DialogHeader>
          <MaterialsUpload
            onUploadSuccess={() => {
              fetchMaterialsCount();
              setUploadOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

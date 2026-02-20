import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  Trophy,
  Clock,
  Target,
  PlayCircle,
} from "lucide-react";
import MaterialsList from "./MaterialsList";
import InternalNavbar from "@/components/InternalNavbar";

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const stats = [
    {
      icon: BookOpen,
      label: "Aulas Concluídas",
      value: "12/30",
      gradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      textColor: "text-blue-900",
    },
    {
      icon: Target,
      label: "Simulados Feitos",
      value: "8",
      gradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500",
      textColor: "text-emerald-900",
    },
    {
      icon: Trophy,
      label: "Melhor Nota",
      value: "92%",
      gradient: "from-violet-50 to-violet-100",
      iconBg: "bg-violet-500",
      textColor: "text-violet-900",
    },
    {
      icon: Clock,
      label: "Horas de Estudo",
      value: "24h",
      gradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      textColor: "text-orange-900",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <InternalNavbar
        navLinks={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Simulados", href: "/simulado" },
        ]}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {profile?.full_name?.split(" ")[0] || "Aluno"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe seu progresso e continue seus estudos
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br ${stat.gradient} border-0 shadow-sm`}>
              <CardContent className="p-5">
                <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Próxima Aula */}
        <Card className="bg-card border border-border shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Próxima Aula</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Nenhuma aula agendada. Agende sua primeira aula prática!
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Agendar Agora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Simulados</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Pratique com questões do DETRAN
                </p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => navigate("/simulado")}>
                Iniciar Simulado
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Agendar Aula</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Marque suas aulas práticas
                </p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Horários
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Meu Progresso</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Acompanhe sua evolução
                </p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Relatório
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Materials */}
        <MaterialsList showDeleteButton={false} />
      </main>
    </div>
  );
}

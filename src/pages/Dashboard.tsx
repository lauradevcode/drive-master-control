import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock, 
  Target,
  LogOut,
  User,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MaterialsList from "./MaterialsList";

export default function Dashboard() {
  const { user, profile, isActive, isAdmin, isInstructor, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <span className="text-sm text-muted-foreground">
              Olá, <span className="font-medium text-foreground">{profile?.full_name || user?.email}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bem-vindo ao Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu progresso e continue seus estudos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Aulas Concluídas", value: "12/30" },
            { icon: Target, label: "Simulados Feitos", value: "8" },
            { icon: Trophy, label: "Melhor Nota", value: "92%" },
            { icon: Clock, label: "Horas de Estudo", value: "24h" },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Simulados</h3>
              <p className="text-muted-foreground text-sm">
                Pratique com questões do DETRAN
              </p>
              <Button className="w-full" onClick={() => navigate("/simulado")}>Iniciar Simulado</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Agendar Aula</h3>
              <p className="text-muted-foreground text-sm">
                Marque suas aulas práticas
              </p>
              <Button variant="outline" className="w-full">Ver Horários</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Meu Progresso</h3>
              <p className="text-muted-foreground text-sm">
                Acompanhe sua evolução
              </p>
              <Button variant="outline" className="w-full">Ver Relatório</Button>
            </CardContent>
          </Card>
        </div>

        {/* Materials from Instructor */}
        <div className="mt-8">
          <MaterialsList showDeleteButton={false} />
        </div>
      </main>
    </div>
  );
}
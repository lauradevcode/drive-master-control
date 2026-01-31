import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Car, 
  BookOpen, 
  Users, 
  Upload,
  LogOut,
  Plus,
  FileText,
  Video,
  BarChart3,
  Menu,
  Home,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MaterialsUpload from "./MaterialsUpload";
import MaterialsList from "./MaterialsList";

interface LearningTrack {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

export default function InstructorDashboard() {
  const { user, profile, isInstructor, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [refreshMaterials, setRefreshMaterials] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Removed login check for demo purposes

  useEffect(() => {
    if (user && (isInstructor || isAdmin)) {
      fetchTracks();
    }
  }, [user, isInstructor, isAdmin]);

  const fetchTracks = async () => {
    setLoadingTracks(true);
    try {
      // Table may not exist yet - handle gracefully
      const { data, error } = await supabase
        .from("learning_tracks" as unknown as "profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setTracks(data as unknown as LearningTrack[]);
      }
    } catch {
      console.log("learning_tracks table not yet available");
    }
    setLoadingTracks(false);
  };

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
      {/* Header - Mobile Optimized */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-8 mt-4">
                    <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">AutoEscola</span>
                  </div>
                  
                  <nav className="flex-1 space-y-4">
                    <Link 
                      to="/instrutor" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/materials" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Materiais</span>
                    </Link>
                    <Link 
                      to="/reports" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Relatórios</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </Link>
                  </nav>
                  
                  <div className="border-t pt-4 mt-auto">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{profile?.full_name || user?.email}</p>
                      <p className="text-xs text-muted-foreground">Instrutor</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3 py-2"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - Center on mobile, left on desktop */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold hidden sm:block">AutoEscola</span>
            <span className="text-xl font-bold sm:hidden">Auto</span>
          </Link>

          {/* Desktop Navigation & User Info */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <Link to="/instrutor" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/materials" className="text-sm font-medium hover:text-primary transition-colors">
                Materiais
              </Link>
              <Link to="/reports" className="text-sm font-medium hover:text-primary transition-colors">
                Relatórios
              </Link>
            </nav>
            
            <div className="flex items-center gap-4 pl-4 border-l">
              <span className="text-sm text-muted-foreground">
                Olá, <span className="font-medium text-foreground">{profile?.full_name || user?.email}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* User Avatar for mobile - Right side */}
          <div className="lg:hidden">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Painel do Instrutor</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas trilhas de aprendizado e conteúdos
          </p>
        </div>

        {/* Stats - Full width fluid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8 w-full">
          {[
            { icon: BookOpen, label: "Trilhas Criadas", value: tracks.length.toString() },
            { icon: FileText, label: "PDFs", value: "0" },
            { icon: Video, label: "Vídeos", value: "0" },
            { icon: Users, label: "Alunos Ativos", value: "4" },
          ].map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow w-full h-full">
              <CardContent className="p-4 md:p-6 h-full flex items-center">
                <div className="flex items-center gap-3 md:gap-4 w-full">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xl md:text-2xl font-bold truncate">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions - Full width fluid grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 w-full">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2 w-full h-full">
            <CardContent className="p-4 md:p-6 text-center space-y-4 h-full flex flex-col justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Plus className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Nova Trilha</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Crie uma nova trilha de aprendizado
              </p>
              <Button className="w-full">Criar Trilha</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer w-full h-full">
            <CardContent className="p-4 md:p-6 text-center space-y-4 h-full flex flex-col justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Relatórios</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Acompanhe o progresso dos alunos
              </p>
              <Button variant="outline" className="w-full">Ver Relatórios</Button>
            </CardContent>
          </Card>
        </div>

        {/* Materials Upload - Full width */}
        <div className="w-full mb-6 md:mb-8">
          <MaterialsUpload onUploadSuccess={() => setRefreshMaterials(prev => prev + 1)} />
        </div>

        {/* Materials List - Full width */}
        <div className="w-full">
          <MaterialsList refreshTrigger={refreshMaterials} showDeleteButton={true} />
        </div>
      </main>
    </div>
  );
}

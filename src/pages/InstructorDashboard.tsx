import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Car, 
  BookOpen, 
  Users, 
  Upload,
  LogOut,
  Plus,
  FileText,
  Video,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isInstructor && !isAdmin) {
      navigate("/dashboard");
    }
  }, [user, isInstructor, isAdmin, loading, navigate]);

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
        .from("learning_tracks" as any)
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AutoEscola</span>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
              Instrutor
            </span>
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
          <h1 className="text-3xl font-bold">Painel do Instrutor</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas trilhas de aprendizado e conteúdos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Trilhas Criadas", value: tracks.length.toString() },
            { icon: FileText, label: "PDFs", value: "0" },
            { icon: Video, label: "Vídeos", value: "0" },
            { icon: Users, label: "Alunos Ativos", value: "0" },
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

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Nova Trilha</h3>
              <p className="text-muted-foreground text-sm">
                Crie uma nova trilha de aprendizado
              </p>
              <Button className="w-full">Criar Trilha</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Upload de Conteúdo</h3>
              <p className="text-muted-foreground text-sm">
                Adicione PDFs e vídeos às trilhas
              </p>
              <Button variant="outline" className="w-full">Fazer Upload</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Relatórios</h3>
              <p className="text-muted-foreground text-sm">
                Acompanhe o progresso dos alunos
              </p>
              <Button variant="outline" className="w-full">Ver Relatórios</Button>
            </CardContent>
          </Card>
        </div>

        {/* Tracks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Minhas Trilhas
            </CardTitle>
            <CardDescription>
              Gerencie suas trilhas de aprendizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTracks ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : tracks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma trilha criada ainda.</p>
                <p className="text-sm">Clique em "Nova Trilha" para começar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{track.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {track.description || "Sem descrição"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        track.is_published 
                          ? "bg-success/10 text-success" 
                          : "bg-warning/10 text-warning"
                      }`}>
                        {track.is_published ? "Publicada" : "Rascunho"}
                      </span>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

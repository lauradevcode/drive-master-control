import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Home,
  Users,
  FileText,
  BookOpen,
  BarChart3,
  Upload,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MaterialsUpload from "./MaterialsUpload";
import MaterialsList from "./MaterialsList";
import InternalNavbar from "@/components/InternalNavbar";
import { cn } from "@/lib/utils";

interface LearningTrack {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

const navItems = [
  { label: "Dashboard", href: "/instrutor", icon: Home },
  { label: "Meus Alunos", href: "/instrutor/alunos", icon: Users },
  { label: "Materiais", href: "/instrutor/materiais", icon: FileText },
  { label: "Trilhas", href: "/instrutor/trilhas", icon: BookOpen },
  { label: "Relatórios", href: "/instrutor/relatorios", icon: BarChart3 },
];

const recentStudents = [
  { name: "Ana Lima", progress: 72, lastActivity: "Há 2 horas" },
  { name: "Carlos Souza", progress: 45, lastActivity: "Há 1 dia" },
  { name: "Fernanda Costa", progress: 90, lastActivity: "Há 30 min" },
  { name: "Roberto Silva", progress: 20, lastActivity: "Há 3 dias" },
];

export default function InstructorDashboard() {
  const { user, profile, isInstructor, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [refreshMaterials, setRefreshMaterials] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && (isInstructor || isAdmin)) fetchTracks();
  }, [user, isInstructor, isAdmin]);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("learning_tracks" as unknown as "profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setTracks(data as unknown as LearningTrack[]);
    } catch {
      console.log("learning_tracks table not yet available");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const stats = [
    { label: "Alunos Ativos", value: "4", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Materiais Enviados", value: "0", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Trilhas Criadas", value: tracks.length.toString(), icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Taxa de Aprovação", value: "78%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={cn(
      "flex flex-col bg-card border-r border-border h-full",
      mobile ? "w-full" : "w-56 shrink-0"
    )}>
      {mobile && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-sm">Menu</span>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      <nav className="flex-1 p-3 space-y-1 pt-4">
        {navItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-accent-foreground">
              {(profile?.full_name || user?.email || "I")[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{profile?.full_name || "Instrutor"}</p>
            <p className="text-xs text-muted-foreground">Instrutor</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <InternalNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="w-64 h-full shadow-xl">
              <Sidebar mobile />
            </div>
            <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Painel do Instrutor</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Gerencie seus alunos e conteúdos
                </p>
              </div>
            </div>

            {/* Upload modal trigger */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Enviar Material</DialogTitle>
                </DialogHeader>
                <MaterialsUpload
                  onUploadSuccess={() => {
                    setRefreshMaterials((p) => p + 1);
                    setUploadOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-card border border-border shadow-sm">
                <CardContent className="p-5">
                  <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom grid: recent students + materials */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Students */}
            <Card className="bg-card border border-border shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Alunos Recentes
                </h2>
                <div className="space-y-4">
                  {recentStudents.map((student, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.lastActivity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                          {student.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Materials list */}
            <MaterialsList refreshTrigger={refreshMaterials} showDeleteButton={true} />
          </div>
        </main>
      </div>
    </div>
  );
}

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  Package,
  UserCheck,
  Menu,
  Mail,
  ShieldCheck,
  ShieldOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InternalNavbar from "@/components/InternalNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <InternalNavbar />
      <div className="flex flex-1">
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          <div className="mb-6 md:mb-8">
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-card border border-border">
                <CardContent className="p-3 md:p-5">
                  <Skeleton className="w-8 h-8 rounded-lg mb-3" />
                  <Skeleton className="h-7 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminContent() {
  const { loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; email: string; role: string; status: string; createdAt: string }[]>([]);
  const [togglingUser, setTogglingUser] = useState<string | null>(null);
  const [instrutoresAtivos, setInstrutoresAtivos] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch all users with roles
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email, status, created_at")
          .order("created_at", { ascending: false });

        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id, role");

        // Count active instrutores
        const { count } = await supabase
          .from("instrutores")
          .select("*", { count: "exact", head: true })
          .eq("status", "aprovado");

        setInstrutoresAtivos(count || 0);

        const roleMap = new Map<string, string[]>();
        (roles || []).forEach((r: any) => {
          const existing = roleMap.get(r.user_id) || [];
          existing.push(r.role);
          roleMap.set(r.user_id, existing);
        });

        const usersData = (profiles || []).map((p: any) => {
          const userRoles = roleMap.get(p.user_id) || ["user"];
          const mainRole = userRoles.includes("admin")
            ? "Admin"
            : userRoles.includes("instrutor")
            ? "Instrutor"
            : "Aluno";
          return {
            id: p.user_id,
            name: p.full_name || "—",
            email: p.email || "—",
            role: mainRole,
            status: p.status || "active",
            createdAt: new Date(p.created_at).toLocaleDateString("pt-BR"),
          };
        });
        setAllUsers(usersData);
      } catch {
        console.log("Failed to fetch admin data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const toggleInstrutorStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setTogglingUser(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus } as any)
      .eq("user_id", userId as any);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível alterar o status." });
    } else {
      toast({ title: "Sucesso", description: `Instrutor ${newStatus === "active" ? "ativado" : "desativado"}.` });
      setAllUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    }
    setTogglingUser(null);
  };

  if (loading || dataLoading) return <AdminSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  // Mock commission data — will be replaced by real tables later
  const comissoesMes = 0;
  const pacotesVendidosMes = 0;
  const alunosComPacote = 0;

  const stats = [
    {
      label: "Comissões do Mês",
      value: formatBRL(comissoesMes),
      sub: "Total de comissões recebidas",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pacotes Vendidos",
      value: pacotesVendidosMes.toString(),
      sub: "Pacotes vendidos este mês",
      icon: Package,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Instrutores Ativos",
      value: instrutoresAtivos.toString(),
      sub: "Com cadastro aprovado",
      icon: UserCheck,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      link: "/admin/autoescolas",
    },
    {
      label: "Alunos com Pacote",
      value: alunosComPacote.toString(),
      sub: "Alunos com pacote ativo",
      icon: Users,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <InternalNavbar />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Visão geral do marketplace
              </p>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-card border border-border shadow-sm">
                <CardContent className="p-3 md:p-5">
                  <div className={`w-8 h-8 md:w-9 md:h-9 ${stat.iconBg} rounded-lg flex items-center justify-center mb-2 md:mb-3`}>
                    <stat.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${stat.iconColor}`} />
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 hidden sm:block">{stat.sub}</p>
                  {stat.link && (
                    <Link to={stat.link} className="inline-flex items-center gap-1 text-[10px] text-primary mt-1.5 hover:underline">
                      Ver lista <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users table */}
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                Usuários Cadastrados ({allUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {allUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum usuário cadastrado ainda.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold">Nome</TableHead>
                        <TableHead className="text-xs font-semibold">Email</TableHead>
                        <TableHead className="text-xs font-semibold">Categoria</TableHead>
                        <TableHead className="text-xs font-semibold">Status</TableHead>
                        <TableHead className="text-xs font-semibold">Cadastro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((u) => (
                        <TableRow key={u.id} className="hover:bg-muted/30">
                          <TableCell className="text-sm font-medium">{u.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              {u.email}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] border-0 ${
                              u.role === "Admin"
                                ? "bg-violet-100 text-violet-700"
                                : u.role === "Instrutor"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.role === "Instrutor" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={togglingUser === u.id}
                                onClick={() => toggleInstrutorStatus(u.id, u.status)}
                                className={`h-7 px-2.5 text-xs font-medium gap-1.5 ${
                                  u.status === "active"
                                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                }`}
                              >
                                {togglingUser === u.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : u.status === "active" ? (
                                  <><ShieldCheck className="w-3.5 h-3.5" /> Ativo</>
                                ) : (
                                  <><ShieldOff className="w-3.5 h-3.5" /> Inativo</>
                                )}
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{u.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <ErrorBoundary>
      <AdminContent />
    </ErrorBoundary>
  );
}

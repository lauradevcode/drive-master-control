import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Users,
  GraduationCap,
  CreditCard,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  MoreHorizontal,
  Shield,
  Menu,
  X,
  CreditCard as PlanIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import InstrutoresTab from "@/components/admin/InstrutoresTab";
import InternalNavbar from "@/components/InternalNavbar";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  status: "active" | "inactive";
  created_at: string;
  email?: string;
  role?: string;
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Usuários", href: "/admin/usuarios", icon: Users },
  { label: "Instrutores", href: "/admin/instrutores", icon: GraduationCap },
  { label: "Planos e Assinaturas", href: "/admin/planos", icon: CreditCard },
  { label: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar os usuários." });
    } else {
      setUsers(data as unknown as UserProfile[]);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const toggleUserStatus = async (userId: string, currentStatus: "active" | "inactive") => {
    setUpdatingUser(userId);
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus } as any)
      .eq("user_id", userId as any);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar o status." });
    } else {
      toast({ title: "Sucesso", description: `Usuário ${newStatus === "active" ? "ativado" : "desativado"} com sucesso.` });
      setUsers(users.map((u) => (u.user_id === userId ? { ...u, status: newStatus } : u)));
    }
    setUpdatingUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const activeUsers = users.filter((u) => u.status === "active").length;

  const filteredUsers = roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

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
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
            <Shield className="w-3 h-3 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">Acesso total</p>
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
          <div className="flex items-center gap-3 mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gerencie usuários, instrutores e configurações do sistema
              </p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Alunos Ativos", value: activeUsers.toString(), icon: Users, bg: "bg-blue-50", color: "text-blue-600" },
              { label: "Total de Instrutores", value: "—", icon: GraduationCap, bg: "bg-emerald-50", color: "text-emerald-600" },
              { label: "Plano Atual", value: "Profissional", icon: PlanIcon, bg: "bg-violet-50", color: "text-violet-600" },
              { label: "Simulados / Mês", value: "—", icon: BarChart3, bg: "bg-orange-50", color: "text-orange-600" },
            ].map((stat, i) => (
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

          {/* Tabs: Usuários | Instrutores */}
          <Tabs defaultValue="usuarios">
            <TabsList className="mb-6">
              <TabsTrigger value="usuarios" className="gap-2">
                <Users className="w-4 h-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="instrutores" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Instrutores
              </TabsTrigger>
            </TabsList>

            {/* ── Users Tab ── */}
            <TabsContent value="usuarios">
              <Card className="bg-card border border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Usuários Cadastrados
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Role filter */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue placeholder="Filtrar role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="user">Aluno</SelectItem>
                        <SelectItem value="instrutor">Instrutor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loadingUsers} className="h-8 text-xs">
                      <RefreshCw className={`w-3 h-3 mr-1 ${loadingUsers ? "animate-spin" : ""}`} />
                      Atualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {loadingUsers ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      Nenhum usuário encontrado.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-xs font-semibold">Nome</TableHead>
                            <TableHead className="text-xs font-semibold">Telefone</TableHead>
                            <TableHead className="text-xs font-semibold">Role</TableHead>
                            <TableHead className="text-xs font-semibold">Status</TableHead>
                            <TableHead className="text-xs font-semibold">Cadastro</TableHead>
                            <TableHead className="text-xs font-semibold">Último Acesso</TableHead>
                            <TableHead className="w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((userProfile) => (
                            <TableRow key={userProfile.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium text-sm">
                                {userProfile.full_name || "Sem nome"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {userProfile.phone || "—"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-muted text-muted-foreground border-0"
                                >
                                  {userProfile.role === "admin"
                                    ? "Admin"
                                    : userProfile.role === "instrutor"
                                    ? "Instrutor"
                                    : "Aluno"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={cn(
                                    "text-xs border-0 gap-1",
                                    userProfile.status === "active"
                                      ? "bg-success/10 text-success"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {userProfile.status === "active" ? (
                                    <><CheckCircle className="w-3 h-3" /> Ativo</>
                                  ) : (
                                    <><XCircle className="w-3 h-3" /> Inativo</>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(userProfile.created_at).toLocaleDateString("pt-BR")}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">—</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0" disabled={updatingUser === userProfile.user_id}>
                                      {updatingUser === userProfile.user_id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <MoreHorizontal className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-44">
                                    <DropdownMenuItem className="cursor-pointer text-sm">
                                      Ver perfil
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-sm">
                                      Alterar role
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer text-sm text-destructive focus:text-destructive"
                                      onClick={() => toggleUserStatus(userProfile.user_id, userProfile.status)}
                                    >
                                      {userProfile.status === "active" ? "Desativar usuário" : "Ativar usuário"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Instrutores Tab ── */}
            <TabsContent value="instrutores">
              <InstrutoresTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

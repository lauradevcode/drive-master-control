import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  TrendingUp,
  CalendarDays,
  HelpCircle,
  Menu,
  MoreHorizontal,
  Mail,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import InternalNavbar from "@/components/InternalNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";

interface ClientData {
  id: string;
  name: string;
  plan: string;
  value: number;
  status: string;
  nextBilling: string;
}

// Will be fetched from Supabase

const planColors: Record<string, string> = {
  Starter: "bg-emerald-100 text-emerald-700",
  Profissional: "bg-blue-100 text-blue-700",
  Premium: "bg-violet-100 text-violet-700",
};

const statusColors: Record<string, string> = {
  Ativo: "bg-emerald-100 text-emerald-700",
  Trial: "bg-amber-100 text-amber-700",
  Atrasado: "bg-red-100 text-red-700",
};

const tooltips: Record<string, string> = {
  MRR: "Soma de todas as assinaturas ativas no mês atual",
  Clientes: "Autoescolas com assinatura ativa e em dia",
  ARR: "MRR × 12. Projeção se nenhum cliente cancelar",
  Vencimento: "Data da próxima renovação de assinatura",
  Churn: "% de clientes que cancelaram nos últimos 30 dias. Abaixo de 5% é saudável.",
  LTV: "Quanto cada cliente gera em média durante todo o tempo que fica ativo.",
  CAC: "Quanto você gasta em média para conquistar 1 novo cliente.",
};

function TooltipIcon({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[220px] text-xs bg-[hsl(215,45%,12%)] text-white border-0"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

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
          {/* Header skeleton */}
          <div className="mb-6 md:mb-8">
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          {/* 4 metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-card border border-border">
                <CardContent className="p-3 md:p-5">
                  <Skeleton className="w-8 h-8 rounded-lg mb-3" />
                  <Skeleton className="h-7 w-24 mb-2" />
                  <Skeleton className="h-3 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Chart + clients */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card className="lg:col-span-3 bg-card border border-border">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-40 mb-4" />
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 bg-card border border-border">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-16 w-full rounded-lg mb-3" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
          {/* 3 growth cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card border border-border">
                <CardContent className="p-5">
                  <Skeleton className="h-3 w-28 mb-3" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-36" />
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
  const [clients, setClients] = useState<{ id: string; name: string; plan: string; value: number; status: string; nextBilling: string }[]>([]);
  const [revenueData, setRevenueData] = useState<{ month: string; value: number }[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; email: string; role: string; createdAt: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const { data: subs } = await (supabase as any)
          .from("assinaturas")
          .select("*")
          .order("created_at", { ascending: false });

        const mapped = (subs || []).map((s: any) => ({
          id: s.id,
          name: s.autoescola_nome,
          plan: s.plano ? s.plano.charAt(0).toUpperCase() + s.plano.slice(1) : "Starter",
          value: Number(s.valor) || 0,
          status: s.status === "ativo" ? "Ativo" : s.status === "trial" ? "Trial" : s.status === "atrasado" ? "Atrasado" : "Cancelado",
          nextBilling: s.proximo_vencimento ? new Date(s.proximo_vencimento).toLocaleDateString("pt-BR") : "—",
        }));
        setClients(mapped);

        // Build last 6 months revenue chart
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const now = new Date();
        const chartData: { month: string; value: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthLabel = months[d.getMonth()];
          const activeInMonth = (subs || []).filter((s: any) => {
            const created = new Date(s.created_at);
            return created <= d && (s.status === "ativo" || s.status === "trial");
          });
          const total = activeInMonth.reduce((sum: number, s: any) => sum + (Number(s.valor) || 0), 0);
          chartData.push({ month: monthLabel, value: total });
        }
        setRevenueData(chartData);

        // Fetch all users with roles
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email, created_at")
          .order("created_at", { ascending: false });

        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id, role");

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

  if (loading || dataLoading) return <AdminSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  const mrr = clients.filter((c) => c.status === "Ativo").reduce((sum, c) => sum + c.value, 0);
  const arr = mrr * 12;
  const activeClients = clients.filter((c) => c.status === "Ativo").length;

  const stats = [
    {
      label: "Receita Mensal Recorrente",
      value: formatBRL(mrr),
      sub: "+R$ 0 vs mês anterior",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      tooltip: tooltips.MRR,
    },
    {
      label: "Autoescolas Pagantes",
      value: activeClients.toString(),
      sub: "0 em trial · 0 churned",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      tooltip: tooltips.Clientes,
    },
    {
      label: "Receita Anual Projetada",
      value: formatBRL(arr),
      sub: "Se mantiver clientes atuais",
      icon: TrendingUp,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      tooltip: tooltips.ARR,
    },
    {
      label: "Próxima Cobrança",
      value: clients.length > 0 ? clients[0].nextBilling : "—",
      sub: clients.length > 0 ? `${clients[0].plan} · ${formatBRL(clients[0].value)}` : "Nenhum cliente",
      icon: CalendarDays,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      tooltip: tooltips.Vencimento,
    },
  ];

  const growthCards = [
    {
      label: "Taxa de Cancelamento",
      value: "0%",
      sub: "Nenhum cancelamento ainda 🎉",
      tooltip: tooltips.Churn,
    },
    {
      label: "Valor Vitalício do Cliente",
      value: formatBRL(arr),
      sub: "Baseado em 12 meses médios",
      tooltip: tooltips.LTV,
    },
    {
      label: "Custo de Aquisição",
      value: "—",
      sub: "Configure seus gastos de marketing",
      tooltip: tooltips.CAC,
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
                Visão geral do seu negócio
              </p>
            </div>
          </div>

          {/* Line 1 — Financial cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-card border border-border shadow-sm relative">
                <CardContent className="p-3 md:p-5">
                  <TooltipIcon text={stat.tooltip} />
                  <div className={`w-8 h-8 md:w-9 md:h-9 ${stat.iconBg} rounded-lg flex items-center justify-center mb-2 md:mb-3`}>
                    <stat.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${stat.iconColor}`} />
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 hidden sm:block">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Line 2 — Chart + Client list */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card className="lg:col-span-3 bg-card border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  Receita Mensal (MRR)
                  <TooltipIcon text="Evolução da receita recorrente nos últimos 6 meses" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[180px] md:h-[220px] lg:h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" tickFormatter={(v) => `R$${v}`} />
                      <RechartsTooltip
                        formatter={(value: number) => [formatBRL(value), "Receita"]}
                        contentStyle={{
                          background: "hsl(215, 45%, 12%)",
                          border: "none",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 13,
                        }}
                      />
                      <ReferenceLine
                        y={2490}
                        stroke="hsl(0, 84%, 60%)"
                        strokeDasharray="6 4"
                        label={{
                          value: "Meta: R$2.490/mês",
                          position: "insideTopRight",
                          fill: "hsl(0, 84%, 60%)",
                          fontSize: 11,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(221, 83%, 53%)"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                        dot={{ r: 4, fill: "hsl(221, 83%, 53%)" }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-card border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  Clientes Ativos
                  <TooltipIcon text="Lista de autoescolas com assinatura ativa" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {(clients || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum cliente ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(clients || []).map((client) => (
                      <div
                        key={client.id}
                        className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge className={`text-[10px] border-0 ${planColors[client.plan] || ""}`}>{client.plan}</Badge>
                            <Badge className={`text-[10px] border-0 ${statusColors[client.status] || ""}`}>{client.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {formatBRL(client.value)}/mês · Vence {client.nextBilling}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 shrink-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="cursor-pointer text-sm">Ver detalhes</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">Alterar plano</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm text-destructive focus:text-destructive">Cancelar assinatura</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Line 3 — Growth metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {growthCards.map((card, i) => (
              <Card key={i} className="bg-card border border-border shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                    <TooltipIcon text={card.tooltip} />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{card.value}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">{card.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Line 4 — Users table */}
          <Card className="bg-card border border-border shadow-sm mt-6 md:mt-8">
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

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DollarSign,
  Users,
  TrendingUp,
  CalendarDays,
  HelpCircle,
  Menu,
  MoreHorizontal,
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

// Mock data
const revenueData = [
  { month: "Set", value: 0 },
  { month: "Out", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dez", value: 249 },
  { month: "Jan", value: 249 },
  { month: "Fev", value: 249 },
];

const clients = [
  {
    id: "1",
    name: "Auto Escola São Paulo",
    plan: "Starter",
    value: 249,
    status: "Ativo",
    nextBilling: "15/03/2026",
  },
];

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

export default function Admin() {
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  const mrr = 249;
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
      value: "15/03",
      sub: "Starter · R$ 249,00",
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
            {/* Revenue chart */}
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
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="hsl(215, 16%, 47%)"
                        tickFormatter={(v) => `R$${v}`}
                      />
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

            {/* Client list */}
            <Card className="lg:col-span-2 bg-card border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  Clientes Ativos
                  <TooltipIcon text="Lista de autoescolas com assinatura ativa" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {clients.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum cliente ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {client.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge className={`text-[10px] border-0 ${planColors[client.plan] || ""}`}>
                              {client.plan}
                            </Badge>
                            <Badge className={`text-[10px] border-0 ${statusColors[client.status] || ""}`}>
                              {client.status}
                            </Badge>
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
                            <DropdownMenuItem className="cursor-pointer text-sm">
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">
                              Alterar plano
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm text-destructive focus:text-destructive">
                              Cancelar assinatura
                            </DropdownMenuItem>
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
        </main>
      </div>
    </div>
  );
}

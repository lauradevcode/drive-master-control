import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DollarSign, Download, Menu, AlertTriangle } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
} from "recharts";
import InternalNavbar from "@/components/InternalNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";

interface Sub {
  id: string;
  name: string;
  plan: string;
  value: number;
  start: string;
  nextBilling: string;
  status: string;
}

const planColors: Record<string, string> = {
  Starter: "bg-emerald-100 text-emerald-700",
  Profissional: "bg-blue-100 text-blue-700",
  Premium: "bg-violet-100 text-violet-700",
};

const statusColors: Record<string, string> = {
  Ativo: "bg-emerald-100 text-emerald-700",
  Trial: "bg-amber-100 text-amber-700",
  Atrasado: "bg-red-100 text-red-700",
  Cancelado: "bg-muted text-muted-foreground",
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function FinanceiroContent() {
  const { loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState("fev-2026");
  const [planFilter, setPlanFilter] = useState("all");
  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setDataLoading(true);
      try {
        const { data } = await (supabase as any)
          .from("assinaturas")
          .select("*")
          .order("created_at", { ascending: false });

        setSubscriptions((data || []).map((s: any) => ({
          id: s.id,
          name: s.autoescola_nome,
          plan: s.plano ? s.plano.charAt(0).toUpperCase() + s.plano.slice(1) : "Starter",
          value: Number(s.valor) || 0,
          start: s.created_at ? new Date(s.created_at).toLocaleDateString("pt-BR") : "—",
          nextBilling: s.proximo_vencimento ? new Date(s.proximo_vencimento).toLocaleDateString("pt-BR") : "—",
          status: s.status === "ativo" ? "Ativo" : s.status === "trial" ? "Trial" : s.status === "atrasado" ? "Atrasado" : "Cancelado",
        })));
      } catch {
        console.log("Failed to fetch subscriptions");
      } finally {
        setDataLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col">
        <InternalNavbar />
        <div className="flex flex-1">
          <main className="flex-1 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-56 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-card border border-border">
                  <CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-card border border-border mb-6">
              <CardContent className="p-5"><Skeleton className="h-[200px] w-full" /></CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const filtered = planFilter === "all" ? subscriptions : subscriptions.filter((s) => s.plan === planFilter);
  const totalMonth = filtered.reduce((sum, s) => sum + s.value, 0);
  const inadimplentes = filtered.filter((s) => s.status === "Atrasado").length;

  const pieData = [
    { name: "Starter", value: subscriptions.filter((s) => s.plan === "Starter").length, color: "hsl(142, 71%, 45%)" },
    { name: "Profissional", value: subscriptions.filter((s) => s.plan === "Profissional").length, color: "hsl(221, 83%, 53%)" },
    { name: "Premium", value: subscriptions.filter((s) => s.plan === "Premium").length, color: "hsl(270, 67%, 47%)" },
  ];

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <InternalNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          <div className="flex items-center justify-between gap-3 mb-6 md:mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Receita e Assinaturas</h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Controle financeiro detalhado</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /><span className="hidden sm:inline">Exportar CSV</span><span className="sm:hidden">CSV</span></Button>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-40 h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fev-2026">Fevereiro 2026</SelectItem>
                <SelectItem value="jan-2026">Janeiro 2026</SelectItem>
                <SelectItem value="dez-2025">Dezembro 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="Plano" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os planos</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Profissional">Profissional</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center"><DollarSign className="w-4 h-4 text-emerald-600" /></div>
                <div><p className="text-lg font-bold text-foreground">{formatBRL(totalMonth)}</p><p className="text-xs text-muted-foreground">Total cobrado este mês</p></div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center"><DollarSign className="w-4 h-4 text-blue-600" /></div>
                <div><p className="text-lg font-bold text-foreground">{formatBRL(totalMonth)}</p><p className="text-xs text-muted-foreground">Previsto próximo mês</p></div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
                <div><p className="text-lg font-bold text-foreground">{inadimplentes}</p><p className="text-xs text-muted-foreground">Inadimplentes</p></div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border border-border shadow-sm mb-6 md:mb-8">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Assinaturas</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="hidden md:block rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-semibold">Autoescola</TableHead>
                      <TableHead className="text-xs font-semibold">Plano</TableHead>
                      <TableHead className="text-xs font-semibold">Valor</TableHead>
                      <TableHead className="text-xs font-semibold">Início</TableHead>
                      <TableHead className="text-xs font-semibold">Próx. Vencimento</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium text-sm">{sub.name}</TableCell>
                        <TableCell><Badge className={`text-[10px] border-0 ${planColors[sub.plan] || ""}`}>{sub.plan}</Badge></TableCell>
                        <TableCell className="text-sm">{formatBRL(sub.value)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{sub.start}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{sub.nextBilling}</TableCell>
                        <TableCell><Badge className={`text-[10px] border-0 ${statusColors[sub.status] || ""}`}>{sub.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Nenhuma assinatura encontrada.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden space-y-3">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Nenhuma assinatura encontrada.</p>
                ) : filtered.map((sub) => (
                  <div key={sub.id} className="border border-border rounded-xl p-4 space-y-2">
                    <p className="font-semibold text-sm text-foreground">{sub.name}</p>
                    <div className="flex gap-2">
                      <Badge className={`text-[10px] border-0 ${planColors[sub.plan] || ""}`}>{sub.plan}</Badge>
                      <Badge className={`text-[10px] border-0 ${statusColors[sub.status] || ""}`}>{sub.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Valor:</span> <span className="font-medium">{formatBRL(sub.value)}</span></div>
                      <div><span className="text-muted-foreground">Início:</span> <span className="font-medium">{sub.start}</span></div>
                      <div className="col-span-2"><span className="text-muted-foreground">Próx. Vencimento:</span> <span className="font-medium">{sub.nextBilling}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Distribuição por Plano</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[200px] md:h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData.filter((d) => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.filter((d) => d.value > 0).map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: "hsl(215, 45%, 12%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function Financeiro() {
  return (<ErrorBoundary><FinanceiroContent /></ErrorBoundary>);
}

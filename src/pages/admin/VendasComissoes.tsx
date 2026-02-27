import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DollarSign, Menu, Download } from "lucide-react";
import InternalNavbar from "@/components/InternalNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

// Mock data — will be replaced by real tables later
const mockVendas = [
  { id: "1", data: "25/02/2026", aluno: "João Silva", instrutor: "Carlos Pereira", pacote: "Pacote 10 aulas", valorPago: 1500, percentComissao: 15, valorComissao: 225 },
  { id: "2", data: "22/02/2026", aluno: "Maria Santos", instrutor: "Ana Costa", pacote: "Pacote 5 aulas", valorPago: 800, percentComissao: 15, valorComissao: 120 },
  { id: "3", data: "18/02/2026", aluno: "Pedro Lima", instrutor: "Carlos Pereira", pacote: "Pacote 20 aulas", valorPago: 2800, percentComissao: 15, valorComissao: 420 },
  { id: "4", data: "14/02/2026", aluno: "Carla Mendes", instrutor: "Roberto Alves", pacote: "Pacote 10 aulas", valorPago: 1500, percentComissao: 15, valorComissao: 225 },
  { id: "5", data: "10/02/2026", aluno: "Lucas Rocha", instrutor: "Ana Costa", pacote: "Pacote 5 aulas", valorPago: 800, percentComissao: 15, valorComissao: 120 },
];

const instrutoresUnicos = [...new Set(mockVendas.map((v) => v.instrutor))];

function VendasComissoesContent() {
  const { loading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState("fev-2026");
  const [instrutorFilter, setInstrutorFilter] = useState("all");

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col">
        <InternalNavbar />
        <div className="flex flex-1">
          <main className="flex-1 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-56 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-[300px] w-full" />
          </main>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const filtered = instrutorFilter === "all"
    ? mockVendas
    : mockVendas.filter((v) => v.instrutor === instrutorFilter);

  const totalComissoes = filtered.reduce((sum, v) => sum + v.valorComissao, 0);
  const totalVendas = filtered.reduce((sum, v) => sum + v.valorPago, 0);

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <InternalNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6 md:mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Vendas e Comissões</h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Controle de vendas e comissões da plataforma</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-40 h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fev-2026">Fevereiro 2026</SelectItem>
                <SelectItem value="jan-2026">Janeiro 2026</SelectItem>
                <SelectItem value="dez-2025">Dezembro 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={instrutorFilter} onValueChange={setInstrutorFilter}>
              <SelectTrigger className="w-44 h-9 text-sm"><SelectValue placeholder="Instrutor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os instrutores</SelectItem>
                {instrutoresUnicos.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatBRL(totalComissoes)}</p>
                  <p className="text-xs text-muted-foreground">Total de comissões no período</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatBRL(totalVendas)}</p>
                  <p className="text-xs text-muted-foreground">Total vendido no período</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{filtered.length}</p>
                  <p className="text-xs text-muted-foreground">Pacotes vendidos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales table */}
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Detalhamento de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Desktop table */}
              <div className="hidden md:block rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-semibold">Data</TableHead>
                      <TableHead className="text-xs font-semibold">Aluno</TableHead>
                      <TableHead className="text-xs font-semibold">Instrutor</TableHead>
                      <TableHead className="text-xs font-semibold">Pacote</TableHead>
                      <TableHead className="text-xs font-semibold">Valor Pago</TableHead>
                      <TableHead className="text-xs font-semibold">% Comissão</TableHead>
                      <TableHead className="text-xs font-semibold">Comissão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="text-sm text-muted-foreground">{v.data}</TableCell>
                        <TableCell className="text-sm font-medium">{v.aluno}</TableCell>
                        <TableCell className="text-sm">{v.instrutor}</TableCell>
                        <TableCell className="text-sm">{v.pacote}</TableCell>
                        <TableCell className="text-sm">{formatBRL(v.valorPago)}</TableCell>
                        <TableCell className="text-sm">{v.percentComissao}%</TableCell>
                        <TableCell className="text-sm font-semibold text-emerald-600">{formatBRL(v.valorComissao)}</TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                          Nenhuma venda encontrada no período.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Nenhuma venda encontrada.</p>
                ) : filtered.map((v) => (
                  <div key={v.id} className="border border-border rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm text-foreground">{v.aluno}</p>
                      <span className="text-xs text-muted-foreground">{v.data}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Instrutor: {v.instrutor}</p>
                    <p className="text-xs text-muted-foreground">{v.pacote}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div><span className="text-muted-foreground">Valor:</span> <span className="font-medium">{formatBRL(v.valorPago)}</span></div>
                      <div><span className="text-muted-foreground">%:</span> <span className="font-medium">{v.percentComissao}%</span></div>
                      <div><span className="text-muted-foreground">Comissão:</span> <span className="font-semibold text-emerald-600">{formatBRL(v.valorComissao)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function VendasComissoes() {
  return (<ErrorBoundary><VendasComissoesContent /></ErrorBoundary>);
}

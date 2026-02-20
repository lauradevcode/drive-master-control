import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  RefreshCw,
  Users,
  Clock,
  UserCheck,
  ExternalLink,
  MapPin,
  Phone,
  FileText,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Instrutor {
  id: string;
  full_name: string;
  photo_url: string | null;
  cpf: string | null;
  credenciamento_numero: string | null;
  cidade: string;
  estado: string;
  categoria: string;
  tipo_veiculo: string;
  valor_aula: number | null;
  whatsapp: string;
  descricao: string | null;
  status: string;
  created_at: string;
}

interface Documento {
  id: string;
  tipo: string;
  url: string;
  nome_arquivo: string | null;
}

interface Solicitacao {
  id: string;
  nome_aluno: string;
  telefone: string;
  melhor_horario: string | null;
  observacao: string | null;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pendente: { label: "Pendente", class: "bg-warning/10 text-warning border-warning/20" },
  aprovado: { label: "Aprovado", class: "bg-accent/10 text-accent border-accent/20" },
  rejeitado: { label: "Rejeitado", class: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function InstrutoresTab() {
  const { toast } = useToast();
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedInstrutor, setSelectedInstrutor] = useState<Instrutor | null>(null);
  const [docs, setDocs] = useState<Documento[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchInstrutores();
  }, []);

  const fetchInstrutores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("instrutores")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setInstrutores(data as Instrutor[]);
    setLoading(false);
  };

  const fetchDetail = async (instrutor: Instrutor) => {
    setSelectedInstrutor(instrutor);
    setLoadingDetail(true);
    const [docsRes, solRes] = await Promise.all([
      supabase.from("documentos_instrutor").select("*").eq("instrutor_id", instrutor.id as any),
      supabase.from("solicitacoes_aula").select("*").eq("instrutor_id", instrutor.id as any).order("created_at", { ascending: false }),
    ]);
    setDocs((docsRes.data as Documento[]) ?? []);
    setSolicitacoes((solRes.data as Solicitacao[]) ?? []);
    setLoadingDetail(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const { error } = await supabase
      .from("instrutores")
      .update({ status } as any)
      .eq("id", id as any);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar o status." });
    } else {
      toast({ title: "Sucesso", description: `Status atualizado para ${STATUS_LABELS[status]?.label ?? status}.` });
      setInstrutores((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      if (selectedInstrutor?.id === id) {
        setSelectedInstrutor((prev) => prev ? { ...prev, status } : null);
      }
    }
    setUpdating(null);
  };

  const filtered = filterStatus === "all" ? instrutores : instrutores.filter((i) => i.status === filterStatus);

  const pendentes = instrutores.filter((i) => i.status === "pendente").length;
  const aprovados = instrutores.filter((i) => i.status === "aprovado").length;

  const docTypeLabel: Record<string, string> = {
    documento_foto: "Documento com foto",
    comprovante_credenciamento: "Comprovante de Credenciamento",
    documento_veiculo: "Documento do Veículo",
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{instrutores.length}</p>
              <p className="text-sm text-muted-foreground">Total de Instrutores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendentes}</p>
              <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{aprovados}</p>
              <p className="text-sm text-muted-foreground">Aprovados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4" />
            Instrutores Cadastrados
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Filter badges */}
            <div className="flex gap-1">
              {["all", "pendente", "aprovado", "rejeitado"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border
                    ${filterStatus === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-transparent hover:border-border"
                    }`}
                >
                  {s === "all" ? "Todos" : STATUS_LABELS[s]?.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={fetchInstrutores} disabled={loading}>
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Nenhum instrutor encontrado.
            </div>
          ) : (
            <div className="rounded-b-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor/Aula</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inst) => (
                    <TableRow key={inst.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            {inst.photo_url ? (
                              <img src={inst.photo_url} alt={inst.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs font-bold text-muted-foreground">
                                  {inst.full_name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-sm">{inst.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{inst.cidade}, {inst.estado}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">Cat. {inst.categoria}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {inst.valor_aula ? `R$ ${Number(inst.valor_aula).toFixed(2).replace(".", ",")}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs border ${STATUS_LABELS[inst.status]?.class ?? ""}`}>
                          {STATUS_LABELS[inst.status]?.label ?? inst.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(inst.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fetchDetail(inst)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {inst.status !== "aprovado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/10"
                              disabled={updating === inst.id}
                              onClick={() => updateStatus(inst.id, "aprovado")}
                            >
                              {updating === inst.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            </Button>
                          )}
                          {inst.status !== "rejeitado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={updating === inst.id}
                              onClick={() => updateStatus(inst.id, "rejeitado")}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {inst.status === "aprovado" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                              disabled={updating === inst.id}
                              onClick={() => updateStatus(inst.id, "pendente")}
                              title="Desativar"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedInstrutor} onOpenChange={(open) => { if (!open) setSelectedInstrutor(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Cadastro do Instrutor
              {selectedInstrutor && (
                <Badge className={`text-xs border ml-2 ${STATUS_LABELS[selectedInstrutor.status]?.class ?? ""}`}>
                  {STATUS_LABELS[selectedInstrutor.status]?.label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedInstrutor && (
            <div className="space-y-5 pt-2">
              {/* Photo + basic */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                  {selectedInstrutor.photo_url ? (
                    <img src={selectedInstrutor.photo_url} alt={selectedInstrutor.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {selectedInstrutor.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedInstrutor.full_name}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedInstrutor.cidade}, {selectedInstrutor.estado}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedInstrutor.whatsapp}
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">CPF</p>
                  <p className="font-medium">{selectedInstrutor.cpf ?? "—"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">N° Credenciamento</p>
                  <p className="font-medium">{selectedInstrutor.credenciamento_numero ?? "—"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Categoria</p>
                  <p className="font-medium">Cat. {selectedInstrutor.categoria}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Transmissão</p>
                  <p className="font-medium">{selectedInstrutor.tipo_veiculo}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg col-span-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Valor por aula</p>
                  <p className="font-medium text-primary">
                    {selectedInstrutor.valor_aula
                      ? `R$ ${Number(selectedInstrutor.valor_aula).toFixed(2).replace(".", ",")}`
                      : "A consultar"}
                  </p>
                </div>
              </div>

              {selectedInstrutor.descricao && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium">Descrição</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-3">
                    {selectedInstrutor.descricao}
                  </p>
                </div>
              )}

              {/* Documents */}
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Documentos enviados
                </p>
                {loadingDetail ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : docs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum documento enviado.</p>
                ) : (
                  <div className="space-y-2">
                    {docs.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{docTypeLabel[doc.tipo] ?? doc.tipo}</p>
                          <p className="text-xs text-muted-foreground truncate">{doc.nome_arquivo ?? doc.url}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Solicitações */}
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Solicitações de aula ({solicitacoes.length})
                </p>
                {solicitacoes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma solicitação ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {solicitacoes.slice(0, 5).map((sol) => (
                      <div key={sol.id} className="p-3 border rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{sol.nome_aluno}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(sol.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">{sol.telefone}</p>
                        {sol.melhor_horario && (
                          <p className="text-xs text-muted-foreground">Horário: {sol.melhor_horario}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                {selectedInstrutor.status !== "aprovado" && (
                  <Button
                    className="flex-1"
                    disabled={updating === selectedInstrutor.id}
                    onClick={() => updateStatus(selectedInstrutor.id, "aprovado")}
                  >
                    {updating === selectedInstrutor.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1.5" /> Aprovar</>}
                  </Button>
                )}
                {selectedInstrutor.status !== "rejeitado" && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={updating === selectedInstrutor.id}
                    onClick={() => updateStatus(selectedInstrutor.id, "rejeitado")}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" /> Rejeitar
                  </Button>
                )}
                {selectedInstrutor.status === "aprovado" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={updating === selectedInstrutor.id}
                    onClick={() => updateStatus(selectedInstrutor.id, "pendente")}
                  >
                    Desativar
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

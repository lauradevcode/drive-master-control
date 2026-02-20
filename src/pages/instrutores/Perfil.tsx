import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Car,
  MapPin,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Calendar,
  CheckCircle,
  Star,
  Phone,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Instrutor {
  id: string;
  full_name: string;
  photo_url: string | null;
  cidade: string;
  estado: string;
  categoria: string;
  tipo_veiculo: string;
  valor_aula: number | null;
  descricao: string | null;
  whatsapp: string;
  credenciamento_numero: string | null;
}

export default function PerfilInstrutor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [instrutor, setInstrutor] = useState<Instrutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nome_aluno: "",
    telefone: "",
    melhor_horario: "",
    observacao: "",
  });

  useEffect(() => {
    if (id) fetchInstrutor(id);
  }, [id]);

  const fetchInstrutor = async (instrutorId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("instrutores")
      .select("*")
      .eq("id", instrutorId)
      .eq("status", "aprovado")
      .single();

    if (!error && data) {
      setInstrutor(data as Instrutor);
    } else {
      navigate("/instrutores");
    }
    setLoading(false);
  };

  const handleSolicitarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instrutor) return;
    setSubmitting(true);

    const { error } = await supabase.from("solicitacoes_aula").insert({
      instrutor_id: instrutor.id,
      nome_aluno: formData.nome_aluno.trim(),
      telefone: formData.telefone.trim(),
      melhor_horario: formData.melhor_horario.trim() || null,
      observacao: formData.observacao.trim() || null,
    } as any);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar sua solicitação. Tente novamente.",
      });
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
  };

  const whatsappUrl = instrutor
    ? `https://wa.me/55${instrutor.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Olá, vi seu perfil na plataforma e gostaria de agendar uma aula.")}`
    : "#";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!instrutor) return null;

  const categoriaLabel = {
    A: "Categoria A — Motocicleta",
    B: "Categoria B — Automóvel",
    AB: "Categoria AB — Moto e Carro",
  }[instrutor.categoria] ?? instrutor.categoria;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/instrutores")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Perfil do Instrutor</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Photo + actions */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
                {instrutor.photo_url ? (
                  <img
                    src={instrutor.photo_url}
                    alt={instrutor.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary">
                      {instrutor.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full gap-2 bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,30%)] text-white" size="lg">
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </Button>
              </a>

              <Dialog open={modalOpen} onOpenChange={(open) => {
                setModalOpen(open);
                if (!open) { setSuccess(false); setFormData({ nome_aluno: "", telefone: "", melhor_horario: "", observacao: "" }); }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <Calendar className="w-4 h-4" />
                    Solicitar Aula
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Solicitar Aula</DialogTitle>
                    <DialogDescription>
                      Preencha seus dados e o instrutor entrará em contato.
                    </DialogDescription>
                  </DialogHeader>

                  {success ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg">Solicitação enviada!</h3>
                      <p className="text-muted-foreground text-sm">
                        Sua solicitação foi registrada. O instrutor <strong>{instrutor.full_name}</strong> entrará em contato em breve.
                      </p>
                      <Button className="mt-2" onClick={() => setModalOpen(false)}>
                        Fechar
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSolicitarAula} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="nome_aluno">Seu nome *</Label>
                        <Input
                          id="nome_aluno"
                          placeholder="Nome completo"
                          value={formData.nome_aluno}
                          onChange={(e) => setFormData({ ...formData, nome_aluno: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                        <Input
                          id="telefone"
                          placeholder="(11) 99999-9999"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="horario">Melhor horário</Label>
                        <Input
                          id="horario"
                          placeholder="Ex: Manhãs na semana"
                          value={formData.melhor_horario}
                          onChange={(e) => setFormData({ ...formData, melhor_horario: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="obs">Observação</Label>
                        <Textarea
                          id="obs"
                          placeholder="Alguma informação adicional?"
                          rows={3}
                          value={formData.observacao}
                          onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                        ) : "Enviar Solicitação"}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Cat. {instrutor.categoria}
                </Badge>
                <Badge variant="secondary">{instrutor.tipo_veiculo}</Badge>
                {instrutor.credenciamento_numero && (
                  <Badge variant="outline" className="text-xs">
                    Cred. #{instrutor.credenciamento_numero}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-1">{instrutor.full_name}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{instrutor.cidade}, {instrutor.estado}</span>
              </div>
            </div>

            {/* Price highlight */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor por aula</p>
                  <p className="text-3xl font-bold text-primary">
                    {instrutor.valor_aula
                      ? `R$ ${Number(instrutor.valor_aula).toFixed(2).replace(".", ",")}`
                      : "A consultar"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Habilitações</p>
                  <p className="font-semibold">{categoriaLabel}</p>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Categoria</p>
                    <p className="font-semibold">{instrutor.categoria}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transmissão</p>
                    <p className="font-semibold">{instrutor.tipo_veiculo}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {instrutor.descricao && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Sobre o instrutor</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {instrutor.descricao}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Credenciamento info */}
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Instrutor verificado</p>
                  <p className="text-xs text-muted-foreground">
                    Documentos e credenciamento verificados pela nossa equipe.
                    {instrutor.credenciamento_numero && ` Número de credenciamento: ${instrutor.credenciamento_numero}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

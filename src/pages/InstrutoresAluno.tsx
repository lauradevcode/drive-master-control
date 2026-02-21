import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import InternalNavbar from "@/components/InternalNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Star, CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Instrutor {
  id: string;
  full_name: string;
  categoria: string;
  cidade: string;
  estado: string;
  tipo_veiculo: string;
  valor_aula: number | null;
  photo_url: string | null;
  whatsapp: string;
}

const HORARIOS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export default function InstrutoresAluno() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Scheduling modal state
  const [selectedInstrutor, setSelectedInstrutor] = useState<Instrutor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [observacao, setObservacao] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchInstrutores();
  }, []);

  const fetchInstrutores = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from("instrutores")
      .select("*")
      .eq("status", "aprovado" as any);
    setInstrutores((data as unknown as Instrutor[]) ?? []);
    setLoadingData(false);
  };

  const handleAgendar = async () => {
    if (!selectedInstrutor || !selectedDate || !selectedHorario || !user) return;
    setSubmitting(true);

    const nome = user.user_metadata?.full_name || user.email || "Aluno";
    const horarioFormatado = `${format(selectedDate, "dd/MM/yyyy")} às ${selectedHorario}`;

    const { error } = await supabase.from("solicitacoes_aula").insert({
      instrutor_id: selectedInstrutor.id,
      nome_aluno: nome,
      telefone: "-",
      melhor_horario: horarioFormatado,
      observacao: observacao || null,
    } as any);

    setSubmitting(false);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível agendar. Tente novamente." });
    } else {
      toast({ title: "Agendamento solicitado!", description: `Solicitação enviada para ${selectedInstrutor.full_name}.` });
      setSelectedInstrutor(null);
      setSelectedDate(undefined);
      setSelectedHorario(null);
      setObservacao("");
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <InternalNavbar
        navLinks={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Simulados", href: "/simulado" },
          { label: "Instrutores", href: "/instrutores" },
        ]}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Instrutores Disponíveis
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Escolha seu instrutor e agende uma aula
          </p>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : instrutores.length === 0 ? (
          <Card className="border border-border shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                Nenhum instrutor disponível ainda
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Aguarde seu instrutor ser cadastrado pela autoescola.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instrutores.map((inst) => (
              <Card
                key={inst.id}
                className="border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-accent-foreground">
                        {getInitials(inst.full_name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {inst.full_name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {inst.cidade}, {inst.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      {inst.categoria}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {inst.tipo_veiculo}
                    </span>
                  </div>

                  {/* Rating placeholder */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground">
                      Novo instrutor
                    </span>
                  </div>

                  {inst.valor_aula && (
                    <p className="text-sm font-semibold text-foreground mb-4">
                      R$ {Number(inst.valor_aula).toFixed(2)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        / aula
                      </span>
                    </p>
                  )}

                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => setSelectedInstrutor(inst)}
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Agendar com este instrutor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Scheduling modal */}
      <Dialog
        open={!!selectedInstrutor}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedInstrutor(null);
            setSelectedDate(undefined);
            setSelectedHorario(null);
            setObservacao("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Agendar com {selectedInstrutor?.full_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Date picker */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Selecione uma data
              </Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < today || date > maxDate}
                locale={ptBR}
                className={cn("p-3 pointer-events-auto rounded-lg border")}
              />
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Horário
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {HORARIOS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setSelectedHorario(h)}
                      className={cn(
                        "text-sm py-2 rounded-lg border transition-colors",
                        selectedHorario === h
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-card text-foreground border-border hover:border-accent/50"
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Observation */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Observação (opcional)
              </Label>
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Alguma informação adicional..."
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedInstrutor(null)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={!selectedDate || !selectedHorario || submitting}
                onClick={handleAgendar}
              >
                {submitting ? "Enviando..." : "Confirmar Agendamento"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

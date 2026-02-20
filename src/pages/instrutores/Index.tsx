import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  Loader2,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

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
}

const ESTADOS_BR = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

export default function InstrutoresMarketplace() {
  const navigate = useNavigate();
  const { user, isAdmin, isInstructor } = useAuth();
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCidade, setSearchCidade] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("nome");

  // Quem pode se cadastrar como instrutor: apenas não-logados ou usuários sem role especial
  // Admins e instrutores já têm seus painéis
  const canRegisterAsInstrutor = !user || (!isAdmin && !isInstructor);

  useEffect(() => {
    fetchInstrutores();
  }, []);

  const fetchInstrutores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("instrutores")
      .select("id, full_name, photo_url, cidade, estado, categoria, tipo_veiculo, valor_aula, descricao, whatsapp")
      .eq("status", "aprovado");

    if (!error && data) {
      setInstrutores(data as Instrutor[]);
    }
    setLoading(false);
  };

  const filtered = instrutores
    .filter((i) => {
      const cidadeOk = searchCidade
        ? i.cidade.toLowerCase().includes(searchCidade.toLowerCase())
        : true;
      const catOk = filterCategoria !== "all" ? i.categoria === filterCategoria : true;
      const tipoOk = filterTipo !== "all" ? i.tipo_veiculo === filterTipo : true;
      const estadoOk = filterEstado !== "all" ? i.estado === filterEstado : true;
      return cidadeOk && catOk && tipoOk && estadoOk;
    })
    .sort((a, b) => {
      if (sortBy === "valor_asc") return (a.valor_aula ?? 0) - (b.valor_aula ?? 0);
      if (sortBy === "valor_desc") return (b.valor_aula ?? 0) - (a.valor_aula ?? 0);
      return a.full_name.localeCompare(b.full_name);
    });

  const categoriaColor = (cat: string) => {
    if (cat === "A") return "bg-primary/10 text-primary border-primary/20";
    if (cat === "B") return "bg-accent/10 text-accent border-accent/20";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Instrutores</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão de cadastro: apenas para visitantes e alunos comuns */}
            {canRegisterAsInstrutor && (
              <Link to="/instrutores/cadastro">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sou Instrutor
                </Button>
              </Link>
            )}

            {/* Se está logado como instrutor, atalho pro painel */}
            {isInstructor && !isAdmin && (
              <Link to="/instrutor">
                <Button variant="outline" size="sm">
                  Meu Painel
                </Button>
              </Link>
            )}

            {/* Se é admin, atalho pro painel admin */}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Painel Admin
                </Button>
              </Link>
            )}

            {/* Entrar — apenas para não logados */}
            {!user && (
              <Link to="/login">
                <Button size="sm">Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Marketplace de Instrutores Credenciados
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Encontre o instrutor ideal para você
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Todos os instrutores são verificados e credenciados pelo DETRAN.
            Compare preços, categorias e escolha o melhor para sua necessidade.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cidade..."
                value={searchCidade}
                onChange={(e) => setSearchCidade(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos estados</SelectItem>
                {ESTADOS_BR.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="A">Categoria A (Moto)</SelectItem>
                <SelectItem value="B">Categoria B (Carro)</SelectItem>
                <SelectItem value="AB">Categoria AB</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Transmissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automático">Automático</SelectItem>
                <SelectItem value="Ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 ml-auto">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Ordenar por nome</SelectItem>
                  <SelectItem value="valor_asc">Menor valor</SelectItem>
                  <SelectItem value="valor_desc">Maior valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum instrutor encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros de busca.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filtered.length} instrutor{filtered.length !== 1 ? "es" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((inst) => (
                <Card
                  key={inst.id}
                  className="group overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    {inst.photo_url ? (
                      <img
                        src={inst.photo_url}
                        alt={inst.full_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {inst.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className={`text-xs border ${categoriaColor(inst.categoria)}`}>
                        Cat. {inst.categoria}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-1 truncate">{inst.full_name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{inst.cidade}, {inst.estado}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">por aula</p>
                        <p className="text-lg font-bold text-primary">
                          {inst.valor_aula
                            ? `R$ ${Number(inst.valor_aula).toFixed(2).replace(".", ",")}`
                            : "A consultar"}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {inst.tipo_veiculo}
                      </Badge>
                    </div>
                    <Link to={`/instrutores/${inst.id}`} className="block">
                      <Button className="w-full" size="sm">
                        Ver Perfil
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer CTA — apenas para visitantes e alunos */}
      {canRegisterAsInstrutor && (
        <div className="border-t bg-muted/30 mt-8">
          <div className="container mx-auto px-4 py-8 text-center">
            <h3 className="font-semibold text-lg mb-2">É instrutor credenciado?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Cadastre-se gratuitamente e apareça para centenas de alunos na sua cidade.
            </p>
            <Link to="/instrutores/cadastro">
              <Button variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Quero me cadastrar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedStat } from "@/components/AnimatedStat";
import {
  CalendarDays,
  FileText,
  BarChart3,
  FileBadge,
  HeadphonesIcon,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  Zap,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";

const BRAND = "CNH Pro";

// ─── Dados ────────────────────────────────────────────────────
const BENEFITS = [
  { icon: CalendarDays, title: "Agendamento inteligente", desc: "Aulas e provas organizadas sem conflitos de horário." },
  { icon: FileText,     title: "Simulados ilimitados",   desc: "Prepare seus alunos para a prova do DETRAN com questões atualizadas." },
  { icon: BarChart3,    title: "Relatórios em tempo real", desc: "Acompanhe o desempenho de cada aluno com métricas detalhadas." },
  { icon: FileBadge,    title: "Documentos digitais",    desc: "Contratos e certificados gerados e assinados automaticamente." },
  { icon: HeadphonesIcon, title: "Suporte prioritário",  desc: "Time especializado disponível para te ajudar quando precisar." },
  { icon: ShieldCheck,  title: "Segurança dos dados",    desc: "Seus dados e os dos alunos sempre protegidos e em conformidade com LGPD." },
];

const PLANS = [
  {
    name: "Gratuito",
    price: "R$ 0",
    badge: "14 dias trial",
    badgeCls: "bg-muted text-muted-foreground",
    desc: "Acesso completo por 14 dias. Sem cartão de crédito.",
    ringCls: "border border-border",
    btnVariant: "outline" as const,
    btnLabel: "Iniciar Trial Grátis",
    href: "/cadastro",
    note: "Após 14 dias, escolha um plano para continuar.",
    features: [
      { label: "Alunos ilimitados durante o trial", ok: true },
      { label: "Simulados ilimitados", ok: true },
      { label: "Agendamento de aulas", ok: true },
      { label: "Marketplace de instrutores", ok: true },
      { label: "Suporte por email", ok: true },
    ],
  },
  {
    name: "Starter",
    price: "R$ 249",
    badge: "Mais Acessível",
    badgeCls: "bg-success/10 text-success border border-success/20",
    desc: "Para autoescolas que estão começando a crescer.",
    ringCls: "border-2 border-success/60",
    btnVariant: "outline" as const,
    btnLabel: "Assinar Starter",
    href: "/cadastro",
    note: null,
    features: [
      { label: "Até 50 alunos ativos", ok: true },
      { label: "Simulados ilimitados", ok: true },
      { label: "Agendamento básico de aulas", ok: true },
      { label: "Relatórios essenciais", ok: true },
      { label: "Suporte por email", ok: true },
      { label: "Documentação digital", ok: false },
      { label: "Certificados automáticos", ok: false },
      { label: "Suporte prioritário", ok: false },
    ],
  },
  {
    name: "Profissional",
    price: "R$ 449",
    badge: "Recomendado",
    badgeCls: "bg-accent/10 text-accent border border-accent/20",
    popular: true,
    desc: "O plano completo para autoescolas estabelecidas.",
    ringCls: "border-2 border-accent",
    btnVariant: "default" as const,
    btnLabel: "Assinar Profissional",
    href: "/cadastro",
    note: null,
    features: [
      { label: "Alunos ilimitados", ok: true },
      { label: "Simulados ilimitados", ok: true },
      { label: "Agendamento avançado", ok: true },
      { label: "Relatórios completos + exportação CSV/PDF", ok: true },
      { label: "Documentação e contratos digitais", ok: true },
      { label: "Certificados automáticos", ok: true },
      { label: "Suporte prioritário", ok: true },
    ],
  },
  {
    name: "Premium",
    price: "R$ 799",
    badge: "Redes de Autoescolas",
    badgeCls: "bg-primary/10 text-primary border border-primary/20",
    desc: "Para redes com 2 ou mais unidades.",
    ringCls: "border border-primary/30",
    btnVariant: "outline" as const,
    btnLabel: "Falar com Vendas",
    href: "#contact",
    note: null,
    features: [
      { label: "Múltiplas unidades no mesmo painel", ok: true },
      { label: "Gestão centralizada de instrutores", ok: true },
      { label: "Dashboard individual por unidade", ok: true },
      { label: "Relatórios consolidados da rede", ok: true },
      { label: "API de integração", ok: true },
      { label: "Gestor de conta dedicado", ok: true },
      { label: "SLA garantido", ok: true },
      { label: "Suporte 24/7", ok: true },
    ],
  },
];

const COMPARISON = [
  { feature: "Nº de alunos",          trial: "Ilimitado (14d)", starter: "Até 50", pro: "Ilimitado", premium: "Ilimitado" },
  { feature: "Simulados",             trial: "✓", starter: "✓", pro: "✓", premium: "✓" },
  { feature: "Agendamento",           trial: "✓", starter: "Básico", pro: "Avançado", premium: "Avançado" },
  { feature: "Relatórios",            trial: "✓", starter: "Essenciais", pro: "Completos + Export", premium: "Consolidados" },
  { feature: "Documentos digitais",   trial: "✓", starter: "✗", pro: "✓", premium: "✓" },
  { feature: "Certificados auto.",     trial: "✓", starter: "✗", pro: "✓", premium: "✓" },
  { feature: "Suporte",               trial: "Email", starter: "Email", pro: "Prioritário", premium: "24/7 + Gestor" },
  { feature: "Múltiplas unidades",    trial: "✗", starter: "✗", pro: "✗", premium: "✓" },
];

const FAQS = [
  {
    q: "Preciso de cartão de crédito para começar?",
    a: "Não! O plano gratuito (trial de 14 dias) não exige nenhum dado de pagamento. Você só precisa criar uma conta."
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, sem multas ou burocracia. Você pode cancelar sua assinatura quando quiser diretamente pelo painel."
  },
  {
    q: "O sistema funciona em celular?",
    a: "Sim! A plataforma é 100% responsiva e foi projetada para funcionar perfeitamente em qualquer dispositivo — celular, tablet ou computador."
  },
  {
    q: "Tenho suporte para configurar o sistema?",
    a: "Sim, nosso time está disponível para ajudar na configuração inicial e sempre que você precisar."
  },
];

const LOGOS_PLACEHOLDER = [
  { name: "AutoEscola Rápido", letter: "R", color: "bg-blue-100 text-blue-700" },
  { name: "CFC Central",       letter: "C", color: "bg-green-100 text-green-700" },
  { name: "Dirigir Plus",      letter: "D", color: "bg-purple-100 text-purple-700" },
  { name: "Habilitação SP",    letter: "H", color: "bg-orange-100 text-orange-700" },
  { name: "MetaCNH",           letter: "M", color: "bg-red-100 text-red-700" },
];

// ─── Componente FAQ item ────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left font-display font-semibold text-foreground hover:text-accent transition-colors"
      >
        {q}
        {open ? <ChevronUp className="w-5 h-5 flex-shrink-0 text-accent" /> : <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <p className="pb-5 text-muted-foreground leading-relaxed text-sm">{a}</p>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-sans">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">{BRAND}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: "Planos", href: "#pricing" },
              { label: "Recursos", href: "#features" },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </a>
            ))}
            <Link to="/instrutores" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Instrutores
            </Link>
            <Link to="/simulado" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Simulado
            </Link>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg transition-all hover:scale-105">
                Começar grátis
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-3 animate-fade-in">
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Planos</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Recursos</a>
            <Link to="/instrutores" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Instrutores</Link>
            <Link to="/simulado" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Simulado</Link>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Contato</a>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Link to="/login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Entrar</Button></Link>
              <Link to="/cadastro" className="flex-1"><Button className="w-full bg-accent hover:bg-accent/90 text-white" size="sm">Começar grátis</Button></Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-white via-secondary/60 to-secondary overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div className="space-y-7 text-center lg:text-left">
              <ScrollReveal animation="fade-up" delay={0}>
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-full text-sm font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Plataforma #1 para autoescolas no Brasil
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={80}>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                  Gerencie sua autoescola{" "}
                  <span className="gradient-text">do zero ao certificado</span>
                  {" "}— tudo em um só lugar
                </h1>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={160}>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Agendamento, simulados, relatórios e documentos digitais. Para autoescolas que querem crescer sem complicação.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link to="/cadastro">
                    <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white text-base px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                      Começar grátis agora
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 border-primary/30 hover:border-primary transition-all hover:scale-105">
                      Ver demonstração
                    </Button>
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={320}>
                <p className="text-sm text-muted-foreground flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-1">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Sem cartão de crédito</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> 14 dias grátis</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Suporte incluso</span>
                </p>
              </ScrollReveal>
            </div>

            {/* Dashboard mockup */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="relative lg:block">
                <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
                  {/* Mockup top bar */}
                  <div className="bg-primary px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/30" />
                      <div className="w-3 h-3 rounded-full bg-white/30" />
                      <div className="w-3 h-3 rounded-full bg-white/30" />
                    </div>
                    <div className="flex-1 bg-white/20 rounded-full h-5 mx-4" />
                    <div className="w-6 h-6 rounded-full bg-white/30" />
                  </div>
                  {/* Mockup body */}
                  <div className="p-5 space-y-4 bg-secondary/30">
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Alunos Ativos", val: "247", color: "bg-accent/10 text-accent" },
                        { label: "Aulas Hoje",    val: "18",  color: "bg-success/10 text-success" },
                        { label: "Aprovações",    val: "98%", color: "bg-primary/10 text-primary" },
                      ].map((s) => (
                        <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                          <div className={`text-2xl font-display font-bold ${s.color}`}>{s.val}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    {/* Fake table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">Últimos agendamentos</span>
                        <span className="text-xs text-accent font-medium">Ver todos</span>
                      </div>
                      {["Ana Lima • 14h00", "Carlos Mota • 15h30", "Priscila S. • 17h00"].map((r, i) => (
                        <div key={i} className={`px-4 py-2.5 flex items-center justify-between text-xs ${i < 2 ? "border-b border-border" : ""}`}>
                          <span className="text-muted-foreground">{r}</span>
                          <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-[10px] font-semibold">Confirmado</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/20 rounded-full blur-2xl -z-10" />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Social proof logos */}
        <div className="border-t border-border/50 bg-white/60 backdrop-blur">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-xs text-muted-foreground mb-5 uppercase tracking-widest font-semibold">
              Usado por autoescolas em todo o Brasil
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {LOGOS_PLACEHOLDER.map((l) => (
                <div key={l.name} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <div className={`w-8 h-8 rounded-lg ${l.color} flex items-center justify-center font-display font-bold text-sm`}>
                    {l.letter}
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground hidden sm:block">{l.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-3 mb-14">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest">Recursos</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Tudo que sua autoescola precisa</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Uma plataforma completa para modernizar cada etapa da gestão da sua autoescola.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                <Card className="group border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <b.icon className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_hsl(221,83%,60%)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <ScrollReveal animation="fade-up" delay={0}>
              <AnimatedStat value={500} suffix="+" label="Autoescolas" duration={2000} />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <AnimatedStat value={50000} suffix="+" label="Alunos Ativos" duration={2500} />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <AnimatedStat value={98} suffix="%" label="Taxa de Aprovação" duration={2000} />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-display font-bold">24/7</div>
                <div className="text-white/70 text-sm">Suporte Dedicado</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section id="pricing" className="py-20 md:py-28 section-bg">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-3 mb-14">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest">Preços</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Planos e Preços</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Escolha o plano ideal para o tamanho da sua autoescola
              </p>
            </div>
          </ScrollReveal>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            {PLANS.map((plan, i) => (
              <ScrollReveal key={plan.name} animation="fade-up" delay={i * 80}>
                <Card className={`relative flex flex-col h-full bg-white ${plan.ringCls} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                  <CardContent className="p-6 flex flex-col flex-1 gap-5">
                    {/* Badge */}
                    <div>
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${plan.badgeCls}`}>
                        {plan.badge}
                      </span>
                    </div>

                    {/* Name & price */}
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 leading-snug">{plan.desc}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground text-sm">/mês</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className={`flex items-start gap-2 text-sm ${!f.ok ? "text-muted-foreground/50 line-through" : "text-foreground"}`}>
                          {f.ok
                            ? <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            : <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                          }
                          {f.label}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="space-y-2">
                      <Link to={plan.href} className="block">
                        <Button
                          variant={plan.btnVariant}
                          className={`w-full transition-all hover:scale-105 ${plan.popular ? "bg-accent hover:bg-accent/90 text-white border-0" : ""}`}
                        >
                          {plan.btnLabel}
                        </Button>
                      </Link>
                      {plan.note && (
                        <p className="text-[11px] text-muted-foreground text-center leading-tight">{plan.note}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Garantia */}
          <ScrollReveal animation="fade-up">
            <p className="text-center text-sm text-muted-foreground flex flex-wrap justify-center gap-x-6 gap-y-1 mb-14">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> 14 dias grátis em todos os planos</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Sem cartão de crédito no trial</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Cancele quando quiser</span>
            </p>
          </ScrollReveal>

          {/* Tabela comparativa */}
          <ScrollReveal animation="fade-up">
            <div className="max-w-5xl mx-auto overflow-x-auto rounded-2xl border border-border shadow-sm">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3.5 font-display font-bold text-foreground">Recurso</th>
                    {["Gratuito", "Starter", "Profissional", "Premium"].map((h) => (
                      <th key={h} className={`px-4 py-3.5 font-display font-bold text-center ${h === "Profissional" ? "text-accent" : "text-foreground"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-secondary/30"}`}>
                      <td className="px-5 py-3 font-medium text-foreground">{row.feature}</td>
                      {[row.trial, row.starter, row.pro, row.premium].map((val, j) => (
                        <td key={j} className={`px-4 py-3 text-center ${val === "✓" ? "text-success font-bold text-base" : val === "✗" ? "text-muted-foreground/40 text-base" : "text-muted-foreground"} ${j === 2 ? "bg-accent/5" : ""}`}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── DEPOIMENTO ── */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(221,83%,50%)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold">O que dizem nossas autoescolas</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="scale">
            <div className="max-w-2xl mx-auto bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
              <div className="flex justify-center mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-warning fill-current" />
                ))}
              </div>
              <blockquote className="text-lg md:text-xl leading-relaxed text-white/90 mb-6 italic">
                "Desde que comecei a usar o sistema, reduzi em 80% o tempo gasto com papelada e meus alunos adoram os simulados online."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-sm">
                  JC
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-sm">João Carlos</p>
                  <p className="text-white/60 text-xs">Diretor — AutoEscola Central, SP</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-3 mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest">Dúvidas</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Perguntas frequentes</h2>
            </div>
          </ScrollReveal>
          <div className="max-w-2xl mx-auto">
            {FAQS.map((f, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 60}>
                <FaqItem q={f.q} a={f.a} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 section-bg border-t border-border">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="scale">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Pronto para transformar sua autoescola?
              </h2>
              <p className="text-muted-foreground text-lg">
                Comece hoje, sem cartão de crédito. 14 dias com tudo liberado.
              </p>
              <Link to="/cadastro">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-base px-10 shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                  Criar conta gratuita
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-14 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Phone, title: "Telefone", value: "(11) 99999-9999" },
              { icon: Mail,  title: "Email",    value: "contato@cnhpro.com.br" },
              { icon: MapPin,title: "Endereço", value: "São Paulo, SP — Brasil" },
            ].map(({ icon: Icon, title, value }, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                <div className="group space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <p className="font-display font-semibold text-sm">{title}</p>
                  <p className="text-muted-foreground text-sm">{value}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">{BRAND}</span>
            </Link>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60">
              <a href="#pricing"   className="hover:text-white transition-colors">Planos</a>
              <a href="#contact"   className="hover:text-white transition-colors">Suporte</a>
              <a href="#"          className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#"          className="hover:text-white transition-colors">Privacidade</a>
            </nav>

            <p className="text-sm text-white/40 text-center md:text-right">
              © 2025 {BRAND}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

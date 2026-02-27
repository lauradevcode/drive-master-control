import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedStat } from "@/components/AnimatedStat";
import {
  UserPlus,
  Search,
  CreditCard,
  CalendarCheck,
  FileText,
  Clock,
  Bell,
  DollarSign,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  Zap,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Car,
} from "lucide-react";

const BRAND = "CNH Fácil";

// ─── Dados ────────────────────────────────────────────────────

const ALUNO_STEPS = [
  { icon: UserPlus, title: "Crie sua conta grátis", desc: "Em 2 minutos você está pronto para começar." },
  { icon: Search, title: "Escolha seu instrutor", desc: "Filtre por localização, preço e avaliações reais." },
  { icon: CreditCard, title: "Compre seu pacote de aulas", desc: "Mínimo de 2 aulas com pagamento 100% seguro." },
  { icon: CalendarCheck, title: "Agende e dirija", desc: "Agende direto pelo app e apareça para dirigir." },
];

const INSTRUTOR_STEPS = [
  { icon: FileText, title: "Cadastre seu perfil", desc: "Gratuito, sem taxa de entrada." },
  { icon: Clock, title: "Configure horários e preços", desc: "Defina sua região de atuação e disponibilidade." },
  { icon: Bell, title: "Receba solicitações", desc: "Alunos entram em contato diretamente." },
  { icon: DollarSign, title: "Receba seu pagamento", desc: "Automaticamente após a aula, em até 2 dias úteis." },
];

const SECURITY_CARDS = [
  {
    icon: ShieldCheck,
    title: "Para o Aluno",
    desc: "Seu dinheiro só é liberado após a aula acontecer.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: DollarSign,
    title: "Para o Instrutor",
    desc: "Sem risco de calote. Receba em até 2 dias úteis.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Lock,
    title: "Para todos",
    desc: "Criptografia bancária e conformidade com LGPD.",
    color: "bg-primary/10 text-primary",
  },
];

const FAQS = [
  {
    q: "Como funciona o pagamento?",
    a: "O aluno paga pelo app antes da aula. O valor fica retido e é liberado para o instrutor após a aula ser confirmada.",
  },
  {
    q: "Precisa pagar para se cadastrar?",
    a: "Não. Tanto aluno quanto instrutor se cadastram gratuitamente.",
  },
  {
    q: "Como é definido o pacote mínimo?",
    a: "O pacote mínimo é de 2 aulas para garantir continuidade e segurança para os dois lados.",
  },
  {
    q: "Posso cancelar uma aula?",
    a: "Sim, com até 24h de antecedência sem custo. Cancelamentos tardios têm política específica.",
  },
  {
    q: "O sistema funciona no celular?",
    a: "Sim, funciona perfeitamente em qualquer dispositivo.",
  },
];

// ─── FAQ item ─────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left font-display font-semibold text-foreground hover:text-accent transition-colors"
      >
        {q}
        {open ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0 text-accent" />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-muted-foreground leading-relaxed text-sm">{a}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-sans">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">{BRAND}</span>
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-7">
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Como funciona</a>
            <a href="#instrutores" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Para instrutores</a>
            <a href="#seguranca" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Segurança</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contato</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/instrutores/marketplace">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all hover:scale-105">
                Encontrar instrutor
              </Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 flex flex-col gap-3 animate-fade-in">
            <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Como funciona</a>
            <a href="#instrutores" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Para instrutores</a>
            <a href="#seguranca" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Segurança</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2">Contato</a>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Link to="/login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Entrar</Button></Link>
              <Link to="/instrutores/marketplace" className="flex-1"><Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">Encontrar instrutor</Button></Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-background via-secondary/60 to-secondary overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-full text-sm font-semibold">
                <Users className="w-3.5 h-3.5" />
                Marketplace de instrutores credenciados
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={80}>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                Encontre instrutores credenciados e{" "}
                <span className="gradient-text">comece suas aulas práticas hoje</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Plataforma gratuita para alunos e instrutores. Pagamento seguro e direto pelo sistema.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={240}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/instrutores/marketplace">
                  <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                    Encontrar instrutor agora
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/instrutores/cadastro">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 border-primary/30 hover:border-primary transition-all hover:scale-105">
                    Sou instrutor, quero me cadastrar
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={320}>
              <p className="text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> 100% gratuito para cadastrar</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Pagamento seguro</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> Instrutores verificados</span>
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_hsl(221,83%,60%)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <ScrollReveal animation="fade-up" delay={0}>
              <AnimatedStat value={2400} suffix="+" label="Instrutores cadastrados" duration={2000} />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <AnimatedStat value={18000} suffix="+" label="Alunos aprovados" duration={2500} />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <AnimatedStat value={98} suffix="%" label="Pagamentos seguros" duration={2000} />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="space-y-2">
                <div className="text-3xl md:text-5xl font-bold">24/7</div>
                <div className="text-primary-foreground/80 text-sm md:text-base">Suporte</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA — ALUNO ── */}
      <section id="como-funciona" className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-3 mb-14">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest">Para o aluno</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Tire sua CNH sem complicação</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                4 passos simples para começar suas aulas práticas.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {ALUNO_STEPS.map((s, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                <Card className="group border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card h-full">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto group-hover:bg-accent transition-colors duration-300">
                      <s.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mx-auto font-display font-bold text-accent text-sm">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA — INSTRUTOR ── */}
      <section id="instrutores" className="py-20 md:py-28 section-bg">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-3 mb-14">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest">Para o instrutor</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Receba alunos sem pagar nada antecipado</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Cadastre-se grátis e comece a receber solicitações de alunos da sua região.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {INSTRUTOR_STEPS.map((s, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                <Card className="group border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card h-full">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary transition-colors duration-300">
                      <s.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto font-display font-bold text-primary text-sm">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEGURANÇA ── */}
      <section id="seguranca" className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-3 mb-14">
              <p className="text-accent font-semibold text-sm uppercase tracking-widest">Segurança</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Pagamento 100% protegido para os dois lados</h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {SECURITY_CARDS.map((c, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                <Card className="border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card h-full">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center mx-auto`}>
                      <c.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(221,83%,50%)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold">O que dizem nossos usuários</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollReveal animation="scale" delay={0}>
              <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl h-full">
                <div className="flex mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg leading-relaxed text-white/90 mb-6 italic">
                  "Encontrei meu instrutor em 10 minutos e tirei a CNH em 3 meses. Muito mais fácil que ficar ligando pra autoescola."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-sm">CR</div>
                  <div className="text-left">
                    <p className="font-display font-bold text-sm">Camila R.</p>
                    <p className="text-white/60 text-xs">Aluna — São Paulo</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={100}>
              <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl h-full">
                <div className="flex mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg leading-relaxed text-white/90 mb-6 italic">
                  "Dobrei minha carteira de alunos sem gastar nada. O pagamento cai direto, sem dor de cabeça."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-sm">CM</div>
                  <div className="text-left">
                    <p className="font-display font-bold text-sm">Carlos M.</p>
                    <p className="text-white/60 text-xs">Instrutor credenciado</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA INSTRUTOR ── */}
      <section className="py-20 bg-primary/95 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_hsl(221,83%,60%)_0%,_transparent_70%)]" />
        <div className="container mx-auto px-4 relative">
          <ScrollReveal animation="scale">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Você é instrutor? Comece a receber alunos hoje
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Cadastro gratuito. Sem mensalidade. Você só paga uma pequena comissão quando realiza uma aula.
              </p>
              <Link to="/instrutores/cadastro">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-10 shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                  Criar perfil de instrutor grátis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-card">
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

      {/* ── CONTACT ── */}
      <section id="contact" className="py-14 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Phone, title: "Telefone", value: "(11) 99999-9999" },
              { icon: Mail, title: "Email", value: "contato@cnhfacil.com.br" },
              { icon: MapPin, title: "Endereço", value: "São Paulo, SP — Brasil" },
            ].map(({ icon: Icon, title, value }, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                <div className="group space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
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
      <footer className="bg-foreground text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Car className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-lg">{BRAND}</span>
            </Link>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60">
              <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
              <a href="#instrutores" className="hover:text-white transition-colors">Para instrutores</a>
              <a href="#seguranca" className="hover:text-white transition-colors">Segurança</a>
              <a href="#contact" className="hover:text-white transition-colors">Contato</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
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

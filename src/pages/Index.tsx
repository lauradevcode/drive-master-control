import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedStat } from "@/components/AnimatedStat";
import { 
  Car, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Shield,
  Clock,
  Target,
  Headphones,
  Zap,
  X
} from "lucide-react";

const BRAND = "CNH Pro";

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">{BRAND}</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Planos
            </a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Recursos
            </a>
            <Link to="/instrutores" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Instrutores
            </Link>
            <Link to="/simulado" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Simulado
            </Link>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm" className="transition-all hover:scale-105 hover:shadow-lg">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Sistema completo para autoescolas
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Gestão de Autoescola 
                <span className="gradient-text"> Simplificada</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Plataforma completa para gerenciar alunos, aulas, simulados e muito mais. 
                Tudo o que você precisa para sua autoescola crescer.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/cadastro">
                  <Button size="lg" className="text-lg px-8 transition-all hover:scale-105 hover:shadow-xl group">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button variant="outline" size="lg" className="text-lg px-8 transition-all hover:scale-105 hover:shadow-lg">
                    Ver Planos
                  </Button>
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400}>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 transition-transform hover:scale-105">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Plano gratuito disponível
                </div>
                <div className="flex items-center gap-2 transition-transform hover:scale-105">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Setup em 5 minutos
                </div>
                <div className="flex items-center gap-2 transition-transform hover:scale-105">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Suporte especializado
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Planos e Preços</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Escolha o plano ideal para o tamanho da sua autoescola
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Gratuito",
                price: "R$ 0",
                badge: "14 dias trial",
                badgeColor: "bg-accent/10 text-accent",
                description: "Acesso completo por 14 dias. Sem cartão de crédito.",
                features: [
                  "Acesso completo por 14 dias",
                  "Alunos ilimitados no trial",
                  "Simulados e agendamento",
                  "Suporte por email",
                  "Marketplace de instrutores",
                ],
                limitations: [],
                cta: "Iniciar Trial Grátis",
                variant: "outline" as const,
              },
              {
                name: "Starter",
                price: "R$ 249",
                badge: null,
                badgeColor: "",
                description: "Para autoescolas que estão começando a crescer.",
                features: [
                  "Até 100 alunos",
                  "Simulados ilimitados",
                  "Agendamento básico",
                  "Relatórios essenciais",
                  "Suporte por email",
                ],
                limitations: [],
                cta: "Assinar Starter",
                variant: "outline" as const,
              },
              {
                name: "Profissional",
                price: "R$ 449",
                badge: "Mais Popular",
                badgeColor: "",
                popular: true,
                description: "O plano completo para autoescolas estabelecidas.",
                features: [
                  "Alunos ilimitados",
                  "Simulados ilimitados",
                  "Agendamento avançado",
                  "Relatórios completos + exportação",
                  "Documentação digital",
                  "Certificados automáticos",
                  "Suporte prioritário",
                ],
                limitations: [],
                cta: "Assinar Profissional",
                variant: "default" as const,
              },
              {
                name: "Premium",
                price: "R$ 799",
                badge: "Redes de Autoescolas",
                badgeColor: "bg-primary/10 text-primary",
                description: "Para redes com 2 ou mais unidades.",
                features: [
                  "Múltiplas unidades",
                  "Gestão centralizada",
                  "Dashboard por unidade",
                  "Relatórios consolidados",
                  "API de integração",
                  "Gestor de conta dedicado",
                  "SLA garantido",
                  "Suporte 24/7",
                ],
                limitations: [],
                cta: "Falar com Vendas",
                variant: "outline" as const,
              },
            ].map((plan, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 80}>
                <Card
                  className={`border-0 shadow-lg relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col ${plan.popular ? "ring-2 ring-primary" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                      Mais Popular
                    </div>
                  )}
                  {plan.badge && !plan.popular && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.badgeColor} border border-current/20 px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap`}>
                      {plan.badge}
                    </div>
                  )}
                  <CardContent className="p-6 space-y-5 flex flex-col flex-1">
                    <div className="space-y-1 pt-2">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground leading-snug">{plan.description}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">/mês</span>
                    </div>

                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link to={plan.name === "Premium" ? "#contact" : "/cadastro"} className="block mt-auto">
                      <Button
                        className="w-full transition-all hover:scale-105"
                        variant={plan.variant}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Tudo que você precisa</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recursos completos para modernizar a gestão da sua autoescola
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Gestão de Alunos",
                description: "Cadastre e acompanhe todos os seus alunos em um só lugar, com histórico completo."
              },
              {
                icon: BookOpen,
                title: "Simulados Online",
                description: "Banco de questões atualizado com mais de 1000 perguntas para seus alunos praticarem."
              },
              {
                icon: Clock,
                title: "Agendamento de Aulas",
                description: "Sistema inteligente para agendar aulas teóricas e práticas sem conflitos."
              },
              {
                icon: Target,
                title: "Acompanhamento",
                description: "Monitore o progresso de cada aluno com relatórios detalhados e métricas."
              },
              {
                icon: Shield,
                title: "Documentação",
                description: "Geração automática de documentos e contratos com assinatura digital."
              },
              {
                icon: Award,
                title: "Certificados",
                description: "Emita certificados de conclusão personalizados automaticamente."
              }
            ].map((feature, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                      <feature.icon className="w-6 h-6 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-4 relative">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Números que impressionam</h2>
              <p className="text-primary-foreground/80 text-lg">
                Junte-se a centenas de autoescolas que já confiam em nós
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Headphones className="w-8 h-8" />
                  <span className="text-3xl md:text-5xl font-bold">24/7</span>
                </div>
                <div className="text-primary-foreground/80 text-sm md:text-base">Suporte Dedicado</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="scale">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para transformar sua autoescola?
              </h2>
              <p className="text-lg text-muted-foreground">
                Junte-se a centenas de autoescolas que já modernizaram sua gestão com nossa plataforma.
              </p>
              <Link to="/cadastro">
                <Button size="lg" className="text-lg px-8 transition-all hover:scale-105 hover:shadow-xl group">
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Phone, title: "Telefone", value: "(11) 99999-9999" },
              { icon: Mail, title: "Email", value: "contato@cnhpro.com.br" },
              { icon: MapPin, title: "Endereço", value: "São Paulo, SP - Brasil" }
            ].map((contact, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="space-y-3 group cursor-pointer">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                    <contact.icon className="w-5 h-5 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">{contact.title}</h3>
                  <p className="text-muted-foreground">{contact.value}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">{BRAND}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2025 {BRAND}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

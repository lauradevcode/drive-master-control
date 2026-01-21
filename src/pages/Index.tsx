import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Target
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AutoEscola</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm">Começar Agora</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              Sistema completo para autoescolas
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Gestão de Autoescola 
              <span className="gradient-text"> Simplificada</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plataforma completa para gerenciar alunos, aulas, simulados e muito mais. 
              Tudo o que você precisa para sua autoescola crescer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="text-lg px-8">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Conhecer Recursos
                </Button>
              </a>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                Suporte 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Tudo que você precisa</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recursos completos para modernizar a gestão da sua autoescola
            </p>
          </div>

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
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Autoescolas" },
              { value: "50k+", label: "Alunos" },
              { value: "98%", label: "Aprovação" },
              { value: "24/7", label: "Suporte" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Planos e Preços</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o tamanho da sua autoescola
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Básico",
                price: "R$ 99",
                description: "Ideal para autoescolas iniciantes",
                features: [
                  "Até 50 alunos",
                  "Simulados ilimitados",
                  "Agendamento básico",
                  "Suporte por email"
                ]
              },
              {
                name: "Profissional",
                price: "R$ 199",
                description: "Para autoescolas em crescimento",
                popular: true,
                features: [
                  "Até 200 alunos",
                  "Simulados ilimitados",
                  "Agendamento avançado",
                  "Relatórios completos",
                  "Suporte prioritário"
                ]
              },
              {
                name: "Enterprise",
                price: "R$ 399",
                description: "Para grandes operações",
                features: [
                  "Alunos ilimitados",
                  "Todas as funcionalidades",
                  "API de integração",
                  "Gestor de conta dedicado",
                  "SLA garantido"
                ]
              }
            ].map((plan, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </div>
                )}
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/cadastro" className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Começar Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para transformar sua autoescola?
            </h2>
            <p className="text-lg text-muted-foreground">
              Junte-se a centenas de autoescolas que já modernizaram sua gestão com nossa plataforma.
            </p>
            <Link to="/cadastro">
              <Button size="lg" className="text-lg px-8">
                Criar Conta Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Telefone</h3>
              <p className="text-muted-foreground">(11) 99999-9999</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">contato@autoescola.com</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Endereço</h3>
              <p className="text-muted-foreground">São Paulo, SP - Brasil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">AutoEscola</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AutoEscola. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
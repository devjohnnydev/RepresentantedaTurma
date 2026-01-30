import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import heroImg from "@assets/image_1769783651989.png";
import logoImg from "@assets/image_1769783609016.png";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="SENAI Logo" className="h-8 md:h-12 w-auto" />
            <div className="hidden md:block h-8 w-px bg-border mx-2" />
            <span className="hidden md:block font-display font-bold text-lg text-primary tracking-tight">
              DEV-SESI 2026
            </span>
          </div>
          <Button 
            className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            onClick={() => window.location.href = "/api/login"}
          >
            Entrar no Sistema
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-12 md:py-24 lg:py-32">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImg} 
              alt="Escola SENAI" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
          </div>

          <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left duration-700">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                Eleições 2026
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-tight text-foreground">
                Escolha quem <span className="text-primary">representa</span> você.
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
                A turma de Desenvolvimento de Sistemas – DEV-SESI irá eleger seus representantes. 
                Participe desse processo democrático e ajude a construir um ambiente melhor para todos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-xl shadow-primary/20"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Candidatar-se ou Votar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-sm font-semibold text-muted-foreground mb-4">Atribuições do Representante:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Canal oficial com o professor",
                    "Representar junto à coordenação",
                    "Apoiar em eventos e projetos",
                    "Mediação de conflitos"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Side Cards (Visual Decoration) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-1000 delay-300">
              <Card className="col-span-2 bg-white/90 backdrop-blur shadow-2xl border-0 translate-y-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      JD
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">João da Silva</h3>
                      <Badge variant="secondary">Candidato</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"Quero lutar por mais aulas práticas e organizar campeonatos de programação!"</p>
                </CardContent>
              </Card>
              <Card className="col-start-2 bg-primary text-primary-foreground shadow-2xl border-0 -translate-y-8">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Sua Voz Importa</h3>
                  <p className="text-primary-foreground/90 text-sm">O representante é o elo entre a turma e a coordenação. Escolha com sabedoria.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

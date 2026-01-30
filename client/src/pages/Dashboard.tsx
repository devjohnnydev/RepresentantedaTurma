import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePhase } from "@/hooks/use-settings";
import { useCandidates, useCreateCandidate } from "@/hooks/use-candidates";
import { useVoteStatus, useSubmitVote } from "@/hooks/use-votes";
import { Header } from "@/components/Header";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { CandidateCard } from "@/components/CandidateCard";
import { AdminControls } from "@/components/AdminControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCandidateSchema, type InsertCandidate } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: phaseData, isLoading: isPhaseLoading } = usePhase();
  const { data: candidates, isLoading: isCandidatesLoading } = useCandidates();
  const { data: voteStatus } = useVoteStatus();
  
  const currentPhase = phaseData?.phase || "registration";
  const isAdmin = user?.email?.toLowerCase().includes("johnny") || false;

  // Confetti effect for results page
  useEffect(() => {
    if (currentPhase === "results") {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const random = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#E30613', '#ffffff']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#E30613', '#ffffff']
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [currentPhase]);

  // Render Logic
  if (isAuthLoading || isPhaseLoading || isCandidatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Header />
      
      <main className="container max-w-6xl mx-auto px-4">
        <PhaseIndicator currentPhase={currentPhase} />

        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {currentPhase === "registration" && <RegistrationView candidates={candidates} />}
          {currentPhase === "voting" && <VotingView candidates={candidates} hasVoted={voteStatus?.hasVoted} />}
          {currentPhase === "results" && <ResultsView candidates={candidates} />}
        </div>

        {isAdmin && <AdminControls />}
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components (Views)
// -----------------------------------------------------------------------------

function RegistrationView({ candidates }: { candidates: any[] }) {
  const { mutate: createCandidate, isPending } = useCreateCandidate();
  const [open, setOpen] = useState(false);

  const form = useForm<InsertCandidate>({
    resolver: zodResolver(insertCandidateSchema),
    defaultValues: {
      name: "",
      nickname: "",
      bio: "",
      platform: "",
      photoUrl: "",
      gender: "male",
    },
  });

  const onSubmit = (data: InsertCandidate) => {
    createCandidate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Candidaturas Abertas!</h2>
        <p className="text-muted-foreground text-lg">
          Você tem boas ideias para a turma? Quer fazer a diferença?
          Inscreva-se agora para ser o próximo representante.
        </p>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="text-lg px-8 shadow-lg shadow-primary/25">
              <Plus className="w-5 h-5 mr-2" />
              Quero me candidatar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registro de Candidatura</DialogTitle>
              <DialogDescription>
                Preencha seus dados para concorrer. Seja criativo no seu apelido e plataforma!
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apelido (Nome de Urna)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Zé da Tech" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gênero (concorrerá como representante)</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Masculino</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Feminino</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">Cole um link direto de uma imagem sua.</p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mini Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Quem é você? O que você gosta?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Por que você deve ser o representante?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Suas propostas e ideias para a turma..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Confirmar Candidatura
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Candidatos Registrados
        </h3>
        
        {candidates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-muted-foreground">Nenhum candidato ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VotingView({ candidates, hasVoted }: { candidates: any[], hasVoted?: boolean }) {
  const { mutate: submitVote, isPending } = useSubmitVote();
  const [selectedMale, setSelectedMale] = useState<number | null>(null);
  const [selectedFemale, setSelectedFemale] = useState<number | null>(null);

  const maleCandidates = candidates.filter(c => c.gender === "male" && c.approved);
  const femaleCandidates = candidates.filter(c => c.gender === "female" && c.approved);

  const handleSubmit = () => {
    if (!selectedMale || !selectedFemale) return;
    submitVote({ maleCandidateId: selectedMale, femaleCandidateId: selectedFemale });
  };

  if (hasVoted) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl shadow-xl p-8 border border-border">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Voto Confirmado!</h2>
        <p className="text-muted-foreground">
          Obrigado por exercer sua cidadania escolar. Aguarde a divulgação dos resultados pelo professor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Hora de Votar!</h2>
        <p className="text-muted-foreground">
          Escolha um representante masculino e uma representante feminina. 
          Seu voto é único e secreto.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Male Candidates Section */}
        <section className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-blue-900">Representante Masculino</h3>
          </div>
          
          <div className="grid gap-4">
            {maleCandidates.map(candidate => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                isSelected={selectedMale === candidate.id}
                onSelect={() => setSelectedMale(candidate.id)}
              />
            ))}
            {maleCandidates.length === 0 && (
              <p className="text-muted-foreground italic text-center py-8">Nenhum candidato masculino aprovado.</p>
            )}
          </div>
        </section>

        {/* Female Candidates Section */}
        <section className="space-y-6">
          <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl flex items-center gap-3">
            <div className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-pink-900">Representante Feminino</h3>
          </div>
          
          <div className="grid gap-4">
            {femaleCandidates.map(candidate => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                isSelected={selectedFemale === candidate.id}
                onSelect={() => setSelectedFemale(candidate.id)}
              />
            ))}
            {femaleCandidates.length === 0 && (
              <p className="text-muted-foreground italic text-center py-8">Nenhuma candidata feminina aprovada.</p>
            )}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t z-40">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-sm text-muted-foreground">
            {selectedMale && selectedFemale 
              ? "Pronto para confirmar!" 
              : "Selecione um candidato de cada grupo."}
          </div>
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20"
            disabled={!selectedMale || !selectedFemale || isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Enviando..." : "Confirmar Votos"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResultsView({ candidates }: { candidates: any[] }) {
  const sortedMale = [...candidates]
    .filter(c => c.gender === "male")
    .sort((a, b) => b.votes - a.votes);
    
  const sortedFemale = [...candidates]
    .filter(c => c.gender === "female")
    .sort((a, b) => b.votes - a.votes);

  const maleWinner = sortedMale[0];
  const femaleWinner = sortedFemale[0];

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center mb-16 space-y-4">
        <Badge variant="outline" className="text-primary border-primary px-4 py-1 text-sm uppercase tracking-widest">Oficial</Badge>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">
          Novos Representantes
        </h2>
        <p className="text-xl text-muted-foreground">Gestão 2026 - 1º Semestre</p>
      </div>

      {/* Winners Podium */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        {[maleWinner, femaleWinner].map((winner, idx) => (
          winner && (
            <div key={winner.id} className="relative group perspective">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <Card className="relative bg-background border-yellow-500/50 h-full flex flex-col items-center p-8 overflow-hidden">
                 <div className="absolute top-0 right-0 p-4">
                    <Trophy className="w-12 h-12 text-yellow-500 drop-shadow-lg" />
                 </div>
                 
                 <div className="w-40 h-40 rounded-full border-4 border-yellow-500 p-1 mb-6 shadow-2xl">
                   <img 
                     src={winner.photoUrl || "https://ui-avatars.com/api/?name=" + winner.name} 
                     className="w-full h-full rounded-full object-cover" 
                     alt={winner.nickname}
                   />
                 </div>
                 
                 <h3 className="text-3xl font-bold font-display text-center mb-2">{winner.nickname}</h3>
                 <p className="text-muted-foreground text-center mb-4">{winner.name}</p>
                 <Badge className="bg-yellow-500 text-white text-lg px-4 py-1 pointer-events-none">
                    {winner.votes} Votos
                 </Badge>
              </Card>
            </div>
          )
        ))}
      </div>

      {/* Full Results List */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold border-b pb-4">Resultado Masculino</h3>
          <div className="space-y-4">
            {sortedMale.map((c, index) => (
               <CandidateCard key={c.id} candidate={c} showVotes rank={index + 1} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold border-b pb-4">Resultado Feminino</h3>
          <div className="space-y-4">
            {sortedFemale.map((c, index) => (
               <CandidateCard key={c.id} candidate={c} showVotes rank={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

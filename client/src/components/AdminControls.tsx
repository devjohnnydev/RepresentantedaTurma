import { usePhase, useSetPhase } from "@/hooks/use-settings";
import { useCandidates, useApproveCandidate, useDeleteCandidate } from "@/hooks/use-candidates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlayCircle, StopCircle, Trash2, CheckCircle, BarChart3 } from "lucide-react";
import { type Phase } from "@shared/schema";

export function AdminControls() {
  const { data: phaseData } = usePhase();
  const { data: candidates } = useCandidates();
  const { mutate: setPhase, isPending: isSettingPhase } = useSetPhase();
  const { mutate: approve, isPending: isApproving } = useApproveCandidate();
  const { mutate: remove, isPending: isRemoving } = useDeleteCandidate();

  const currentPhase = phaseData?.phase;

  const handlePhaseChange = (newPhase: Phase) => {
    if (window.confirm(`Tem certeza que deseja mudar para a fase: ${newPhase}?`)) {
      setPhase(newPhase);
    }
  };

  return (
    <div className="space-y-8 mt-12 border-t pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-primary text-white text-xs px-2 py-1 rounded uppercase tracking-wider">Admin</span>
            Painel de Controle
          </h2>
          <p className="text-muted-foreground">Gerencie as fases da eleição e candidatos.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={currentPhase === "registration" ? "default" : "outline"}
            onClick={() => handlePhaseChange("registration")}
            disabled={isSettingPhase}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Inscrições
          </Button>
          <Button 
            variant={currentPhase === "voting" ? "default" : "outline"}
            onClick={() => handlePhaseChange("voting")}
            disabled={isSettingPhase}
          >
            <StopCircle className="w-4 h-4 mr-2" />
            Votação
          </Button>
          <Button 
            variant={currentPhase === "results" ? "default" : "outline"}
            onClick={() => handlePhaseChange("results")}
            disabled={isSettingPhase}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Resultados
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Candidatos ({candidates?.length || 0})</CardTitle>
          <CardDescription>Aprove ou remova candidaturas impróprias.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Apelido</TableHead>
                  <TableHead>Gênero</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates?.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell className="font-medium">{candidate.nickname}</TableCell>
                    <TableCell className="capitalize">{candidate.gender}</TableCell>
                    <TableCell>
                      {candidate.approved ? (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">Aprovado</Badge>
                      ) : (
                        <Badge variant="secondary">Pendente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {!candidate.approved && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => approve(candidate.id)}
                          disabled={isApproving}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Remover este candidato?")) remove(candidate.id);
                        }}
                        disabled={isRemoving}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!candidates || candidates.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum candidato registrado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

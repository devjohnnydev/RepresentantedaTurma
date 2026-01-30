import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type VoteRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useVoteStatus() {
  return useQuery({
    queryKey: [api.votes.status.path],
    queryFn: async () => {
      const res = await fetch(api.votes.status.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vote status");
      return api.votes.status.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitVote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: VoteRequest) => {
      const res = await fetch(api.votes.submit.path, {
        method: api.votes.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit vote");
      }
      return api.votes.submit.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.votes.status.path] });
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path] }); // Update counts if in results phase
      toast({
        title: "Voto Confirmado!",
        description: "Obrigado por participar da eleição.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao votar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

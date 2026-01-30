import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCandidate, type Candidate } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCandidates() {
  return useQuery({
    queryKey: [api.candidates.list.path],
    queryFn: async () => {
      const res = await fetch(api.candidates.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch candidates");
      return api.candidates.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCandidate) => {
      const res = await fetch(api.candidates.create.path, {
        method: api.candidates.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to register candidate");
      }
      return api.candidates.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path] });
      toast({
        title: "Candidatura registrada!",
        description: "Boa sorte na campanha.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useApproveCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.candidates.approve.path, { id });
      const res = await fetch(url, {
        method: api.candidates.approve.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve candidate");
      return api.candidates.approve.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path] });
      toast({ title: "Candidato aprovado!" });
    },
  });
}

export function useDeleteCandidate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.candidates.delete.path, { id });
      const res = await fetch(url, {
        method: api.candidates.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete candidate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path] });
      toast({ title: "Candidato removido" });
    },
  });
}

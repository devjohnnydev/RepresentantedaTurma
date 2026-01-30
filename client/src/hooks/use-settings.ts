import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Phase } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function usePhase() {
  return useQuery({
    queryKey: [api.settings.getPhase.path],
    queryFn: async () => {
      const res = await fetch(api.settings.getPhase.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch phase");
      return api.settings.getPhase.responses[200].parse(await res.json());
    },
  });
}

export function useSetPhase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (phase: Phase) => {
      const res = await fetch(api.settings.setPhase.path, {
        method: api.settings.setPhase.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update phase");
      return api.settings.setPhase.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.settings.getPhase.path], { phase: data.phase });
      toast({ title: "Fase atualizada com sucesso!" });
    },
  });
}

import { cn } from "@/lib/utils";
import { Check, UserPlus, Vote, Trophy } from "lucide-react";
import type { Phase } from "@shared/schema";

interface PhaseIndicatorProps {
  currentPhase: Phase;
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const steps = [
    { id: "registration", label: "Candidatura", icon: UserPlus },
    { id: "voting", label: "Votação", icon: Vote },
    { id: "results", label: "Resultados", icon: Trophy },
  ];

  const getCurrentIndex = () => steps.findIndex(s => s.id === currentPhase);
  const currentIndex = getCurrentIndex();

  return (
    <div className="w-full py-6 md:py-8">
      <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 z-10 bg-background",
                  isActive && "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
              </div>
              <span className={cn(
                "text-xs md:text-sm font-medium transition-colors duration-300",
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { type Candidate } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CandidateCardProps {
  candidate: Candidate;
  isSelected?: boolean;
  onSelect?: () => void;
  showVotes?: boolean;
  rank?: number;
}

export function CandidateCard({ candidate, isSelected, onSelect, showVotes, rank }: CandidateCardProps) {
  return (
    <motion.div
      whileHover={onSelect ? { scale: 1.02 } : {}}
      whileTap={onSelect ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card 
        onClick={onSelect}
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300 border-2",
          onSelect ? "hover:border-primary/50" : "cursor-default",
          isSelected ? "border-primary shadow-lg shadow-primary/10 bg-primary/5" : "border-border",
          "h-full flex flex-col"
        )}
      >
        {/* Header Background */}
        <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5 w-full absolute top-0 left-0" />
        
        <div className="p-6 flex flex-col items-center flex-grow pt-12 relative">
          <Avatar className={cn(
            "w-24 h-24 border-4 shadow-xl mb-4",
            isSelected ? "border-primary" : "border-background"
          )}>
            <AvatarImage src={candidate.photoUrl || undefined} className="object-cover" />
            <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">
              {candidate.nickname[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-2 w-full">
            <h3 className="text-xl font-bold text-foreground font-display">{candidate.nickname}</h3>
            <p className="text-sm font-medium text-muted-foreground line-clamp-1">{candidate.name}</p>
            
            <div className="py-2 w-full">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 text-sm text-muted-foreground border border-border/50 shadow-sm min-h-[5rem] flex items-center justify-center italic">
                "{candidate.platform}"
              </div>
            </div>
          </div>
        </div>

        {/* Footer/Stats Area */}
        <div className="p-4 bg-muted/30 border-t border-border mt-auto">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={candidate.gender === 'male' ? "secondary" : "outline"} className="capitalize">
              {candidate.gender === 'male' ? 'Masculino' : 'Feminino'}
            </Badge>
            
            {showVotes && (
               <div className="flex items-center gap-2">
                 {rank && (
                   <span className={cn(
                     "text-lg font-bold mr-2",
                     rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : "text-amber-700"
                   )}>
                     #{rank}
                   </span>
                 )}
                 <span className="font-bold text-primary">{candidate.votes} votos</span>
               </div>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

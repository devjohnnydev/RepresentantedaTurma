import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import logoImg from "@assets/image_1769783609016.png";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="SENAI Logo" className="h-8 md:h-10 w-auto object-contain" />
          <div className="hidden md:block">
            <h1 className="text-lg font-bold leading-tight text-primary">Eleições 2026</h1>
            <p className="text-xs text-muted-foreground font-medium">DEV-SESI • Morvan Figueiredo</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.firstName} {user.lastName}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email?.includes("johnny") ? "Professor / Admin" : "Aluno"}
                </span>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/10">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary/5 text-primary">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Sair">
              <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

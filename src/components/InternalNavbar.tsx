'use client';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Car, ChevronDown, ArrowLeftRight, User, Settings, LogOut } from "lucide-react";

interface InternalNavbarProps {
  navLinks?: { label: string; href: string }[];
}

export default function InternalNavbar({ navLinks }: InternalNavbarProps) {
  const { user, profile, isAdmin, isInstructor, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = (profile?.full_name || user?.email || "U")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const hasMultipleRoles = isAdmin && isInstructor;

  return (
    <header className="sticky top-0 z-50 h-16 bg-card border-b border-border shadow-sm flex items-center px-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Car className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold text-foreground hidden sm:block">AutoEscola</span>
      </Link>

      {/* Center nav links */}
      {navLinks && navLinks.length > 0 && (
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Role switcher for multi-role users */}
        {hasMultipleRoles && (
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-xs"
            onClick={() => {
              if (isAdmin && window.location.pathname === "/admin") {
                navigate("/instrutor");
              } else {
                navigate("/admin");
              }
            }}
          >
            <ArrowLeftRight className="w-3 h-3" />
            {window.location.pathname === "/admin" ? "Painel Instrutor" : "Painel Admin"}
          </Button>
        )}

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent-foreground">{initials}</span>
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block max-w-[120px] truncate">
                {profile?.full_name || user?.email}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

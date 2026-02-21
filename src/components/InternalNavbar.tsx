'use client';
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Car, ChevronDown, User, Settings, LogOut, ArrowLeftRight, Menu } from "lucide-react";

interface InternalNavbarProps {
  navLinks?: { label: string; href: string }[];
}

export default function InternalNavbar({ navLinks }: InternalNavbarProps) {
  const { user, profile, isAdmin, isInstructor, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = (profile?.full_name || user?.email || "U")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const hasMultipleRoles = isAdmin || isInstructor;
  const currentPath = location.pathname;

  const isActive = (href: string) => currentPath === href;

  return (
    <header className="sticky top-0 z-50 h-16 bg-primary shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center px-4 md:px-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Car className="w-4 h-4 text-accent-foreground" />
        </div>
        <span className="text-base font-bold text-primary-foreground hidden sm:block">AutoEscola</span>
      </Link>

      {/* Center nav links — desktop/tablet only */}
      {navLinks && navLinks.length > 0 && (
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(link.href)
                  ? "text-primary-foreground bg-accent"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Right side — desktop */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Role switcher — desktop */}
        {hasMultipleRoles && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 text-xs border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              >
                <ArrowLeftRight className="w-3 h-3" />
                Alternar Painel
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Ir para
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && currentPath !== "/admin" && (
                <DropdownMenuItem className="cursor-pointer text-sm" onClick={() => navigate("/admin")}>
                  Painel Admin
                </DropdownMenuItem>
              )}
              {isInstructor && currentPath !== "/instrutor" && (
                <DropdownMenuItem className="cursor-pointer text-sm" onClick={() => navigate("/instrutor")}>
                  Painel Instrutor
                </DropdownMenuItem>
              )}
              {currentPath !== "/dashboard" && (
                <DropdownMenuItem className="cursor-pointer text-sm" onClick={() => navigate("/dashboard")}>
                  Ver como Aluno
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* User dropdown — desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-primary-foreground/10 transition-colors">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent-foreground">{initials}</span>
              </div>
              <span className="text-sm font-medium text-primary-foreground max-w-[120px] truncate">
                {profile?.full_name || user?.email}
              </span>
              <ChevronDown className="w-3 h-3 text-primary-foreground/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" /> Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-primary border-primary p-0 flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-primary-foreground/10">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="text-base font-bold text-primary-foreground">AutoEscola</span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navLinks?.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center h-12 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-primary-foreground bg-accent"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Role switcher in drawer */}
              {hasMultipleRoles && (
                <>
                  <div className="border-t border-primary-foreground/10 my-3" />
                  {isAdmin && currentPath !== "/admin" && (
                    <button onClick={() => { navigate("/admin"); setMobileOpen(false); }} className="flex items-center h-12 w-full px-3 rounded-lg text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                      Painel Admin
                    </button>
                  )}
                  {isInstructor && currentPath !== "/instrutor" && (
                    <button onClick={() => { navigate("/instrutor"); setMobileOpen(false); }} className="flex items-center h-12 w-full px-3 rounded-lg text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                      Painel Instrutor
                    </button>
                  )}
                </>
              )}
            </nav>

            {/* User info at bottom */}
            <div className="border-t border-primary-foreground/10 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent-foreground">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-foreground truncate">{profile?.full_name || "Usuário"}</p>
                <p className="text-xs text-primary-foreground/60 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => { handleSignOut(); setMobileOpen(false); }}
              className="mx-5 mb-5 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium text-destructive bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

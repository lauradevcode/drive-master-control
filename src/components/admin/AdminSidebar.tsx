import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  TrendingUp,
  School,
  Users,
  Settings,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "VISÃO GERAL",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "FINANCEIRO",
    items: [
      { label: "Vendas e Comissões", href: "/admin/vendas", icon: DollarSign },
      { label: "Receita e Assinaturas", href: "/admin/financeiro", icon: FileText },
      { label: "Projeções", href: "/admin/projecoes", icon: TrendingUp },
    ],
  },
  {
    label: "CLIENTES",
    items: [
      { label: "Autoescolas", href: "/admin/autoescolas", icon: School },
      { label: "Usuários", href: "/admin/usuarios", icon: Users },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        "flex flex-col bg-card border-r border-border h-full",
        mobile ? "w-full" : "w-60 shrink-0"
      )}
    >
      {mobile && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-sm">Menu</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
            <Shield className="w-3 h-3 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium">Administrador</p>
            <p className="text-xs text-muted-foreground">Dona do Sistema</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 h-full shadow-xl">
            <SidebarContent mobile />
          </div>
          <div className="flex-1 bg-black/40" onClick={onClose} />
        </div>
      )}
    </>
  );
}

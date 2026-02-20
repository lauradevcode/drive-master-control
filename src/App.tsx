import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import PendingAccount from "./pages/PendingAccount";
import Simulado from "./pages/Simulado";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import InstrutoresMarketplace from "./pages/instrutores/Index";
import PerfilInstrutor from "./pages/instrutores/Perfil";
import CadastroInstrutor from "./pages/instrutores/Cadastro";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/pending" element={<PendingAccount />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/instrutor" element={<InstructorDashboard />} />
            <Route path="/simulado" element={<Simulado />} />
            <Route path="/admin" element={<Admin />} />
            {/* Marketplace de Instrutores */}
            <Route path="/instrutores" element={<InstrutoresMarketplace />} />
            <Route path="/instrutores/:id" element={<PerfilInstrutor />} />
            <Route path="/instrutores/cadastro" element={<CadastroInstrutor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
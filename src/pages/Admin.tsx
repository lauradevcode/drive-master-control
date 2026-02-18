import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  Users, 
  LogOut, 
  CheckCircle, 
  XCircle,
  Shield,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  status: "active" | "inactive";
  created_at: string;
  email?: string;
}

export default function Admin() {
  const { user, isAdmin, isInstructor, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  // Removed login check for demo purposes

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
      });
    } else {
      setUsers(data as unknown as UserProfile[]);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleUserStatus = async (userId: string, currentStatus: "active" | "inactive") => {
    setUpdatingUser(userId);
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus } as any)
      .eq("user_id", userId as any);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o status do usuário.",
      });
    } else {
      toast({
        title: "Sucesso",
        description: `Usuário ${newStatus === "active" ? "ativado" : "desativado"} com sucesso.`,
      });
      setUsers(users.map(u => 
        u.user_id === userId ? { ...u, status: newStatus } : u
      ));
    }
    setUpdatingUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.status === "active").length;
  const inactiveUsers = users.filter(u => u.status === "inactive").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AutoEscola</span>
            <Badge variant="secondary" className="ml-2">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </Link>

          <div className="flex items-center gap-2">
            {isInstructor && (
              <Button variant="outline" size="sm" onClick={() => navigate("/instrutor")}>
                Painel Instrutor
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inactiveUsers}</p>
                <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loadingUsers}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário cadastrado ainda.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userProfile) => (
                      <TableRow key={userProfile.id}>
                        <TableCell className="font-medium">
                          {userProfile.full_name || "Sem nome"}
                        </TableCell>
                        <TableCell>{userProfile.phone || "-"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={userProfile.status === "active" ? "default" : "secondary"}
                            className={userProfile.status === "active" 
                              ? "bg-accent text-accent-foreground" 
                              : "bg-warning/10 text-warning border-warning/20"
                            }
                          >
                            {userProfile.status === "active" ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ativo
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Inativo
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(userProfile.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={userProfile.status === "active" ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleUserStatus(userProfile.user_id, userProfile.status)}
                            disabled={updatingUser === userProfile.user_id}
                          >
                            {updatingUser === userProfile.user_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : userProfile.status === "active" ? (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Ativar
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Download, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path?: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

interface MaterialsListProps {
  refreshTrigger?: number;
  showDeleteButton?: boolean;
}

export default function MaterialsList({ refreshTrigger, showDeleteButton = false }: MaterialsListProps) {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // Try to fetch from database
      const { data, error } = await supabase
        .from("materials" as unknown as "profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist, use localStorage
        if (error.message.includes("relation") || error.message.includes("materials")) {
          console.log("Usando fallback localStorage para materiais");
          const localMaterials = JSON.parse(localStorage.getItem("materials") || "[]");
          setMaterials(localMaterials as Material[]);
        } else {
          throw error;
        }
      } else {
        setMaterials(data as unknown as Material[]);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      // Fallback to localStorage
      const localMaterials = JSON.parse(localStorage.getItem("materials") || "[]");
      setMaterials(localMaterials as Material[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [refreshTrigger]);

  const handleDelete = async (material: Material) => {
    if (!window.confirm(`Tem certeza que deseja deletar "${material.title}"?`)) return;

    setDeleting(material.id);
    try {
      // Try to delete from storage
      if (material.file_path) {
        await supabase.storage
          .from("materials")
          .remove([material.file_path]);
      }

      // Try to delete from database
      const { error } = await supabase
        .from("materials" as unknown as "profiles")
        .delete()
        .eq("id", material.id as any);

      if (error && !error.message.includes("relation")) {
        throw error;
      }

      // If database deletion failed, try localStorage
      if (error) {
        const localMaterials = JSON.parse(localStorage.getItem("materials") || "[]");
        const filtered = localMaterials.filter((m: Material) => m.id !== material.id);
        localStorage.setItem("materials", JSON.stringify(filtered));
      }

      toast({
        title: "Sucesso",
        description: "Material deletado com sucesso.",
      });

      fetchMaterials();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível deletar o material.",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Materiais Disponíveis
        </CardTitle>
        <CardDescription>
          {materials.length} material(is) enviado(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum material disponível ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{material.title}</h4>
                    {material.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {material.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(material.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  {showDeleteButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(material)}
                      disabled={deleting === material.id}
                    >
                      {deleting === material.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-destructive" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

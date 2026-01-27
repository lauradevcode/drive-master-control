import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UploadMaterialProps {
  onUploadSuccess?: () => void;
}

export default function MaterialsUpload({ onUploadSuccess }: UploadMaterialProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha o título do material",
      });
      return;
    }

    // Ler arquivo direto do input
    const file = fileInputRef.current?.files?.[0];
    
    if (!file) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um arquivo",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `materials/${fileName}`;

      console.log("Arquivo:", file.name);
      console.log("Tipo:", file.type);
      console.log("Tamanho:", file.size);
      console.log("Iniciando upload para:", filePath);

      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("materials")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        
        // Se o bucket não existe, usar localStorage
        console.log("Usando fallback localStorage (bucket não existe)");
        const localMaterials = JSON.parse(localStorage.getItem("materials") || "[]");
        localMaterials.push({
          id: `local_${Date.now()}`,
          title,
          description,
          file_url: URL.createObjectURL(file),
          file_path: filePath,
          file_type: file.type,
          uploaded_by: user?.id || "demo",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("materials", JSON.stringify(localMaterials));
        
        toast({
          title: "Sucesso!",
          description: "Material armazenado localmente",
        });
        
        setTitle("");
        setDescription("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        onUploadSuccess?.();
        setUploading(false);
        return;
      }

      console.log("Arquivo enviado com sucesso:", uploadData);

      // Get public URL
      const { data } = supabase.storage
        .from("materials")
        .getPublicUrl(filePath);

      console.log("URL pública:", data.publicUrl);

      // Try to create material record
      const { error: dbError } = await supabase
        .from("materials" as unknown as "profiles")
        .insert([
          {
            title,
            description,
            file_url: data.publicUrl,
            file_path: filePath,
            file_type: file.type,
            uploaded_by: user?.id || "demo",
          },
        ] as any);

      if (dbError) {
        console.warn("Database error (esperado se tabela não existe):", dbError.message);
        // Se a tabela não existe, salva em localStorage como fallback
        const localMaterials = JSON.parse(localStorage.getItem("materials") || "[]");
        localMaterials.push({
          id: `db_${Date.now()}`,
          title,
          description,
          file_url: data.publicUrl,
          file_path: filePath,
          file_type: file.type,
          uploaded_by: user?.id || "demo",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("materials", JSON.stringify(localMaterials));
      }

      toast({
        title: "Sucesso!",
        description: "Material enviado com sucesso.",
      });

      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onUploadSuccess?.();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível enviar o material.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload de Material
        </CardTitle>
        <CardDescription>
          Envie PDFs, vídeos ou outros arquivos para seus alunos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="title">Título do Material</Label>
            <Input
              id="title"
              placeholder="Ex: Aula sobre Direção Defensiva"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Descrição breve do material"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div>
            <Label htmlFor="file">Selecionar Arquivo</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                disabled={uploading}
                accept=".pdf,.mp4,.mov,.avi,.jpg,.png,.doc,.docx"
              />
              {fileInputRef.current?.files?.[0] && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {fileInputRef.current.files[0].name}
                </span>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={uploading || !title}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviar Material
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

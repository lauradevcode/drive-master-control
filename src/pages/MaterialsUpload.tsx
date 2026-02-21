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
      toast({ variant: "destructive", title: "Erro", description: "Preencha o título do material" });
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({ variant: "destructive", title: "Erro", description: "Selecione um arquivo" });
      return;
    }

    if (!user) {
      toast({ variant: "destructive", title: "Erro", description: "Você precisa estar logado" });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage bucket 'materiais'
      const { error: uploadError } = await supabase.storage
        .from("materiais")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from("materiais").getPublicUrl(filePath);

      // Determine tipo
      const tipo = file.type.includes("pdf") ? "pdf" : file.type.includes("video") ? "video" : "outro";

      // Insert into materiais table
      const { error: dbError } = await (supabase as any)
        .from("materiais")
        .insert({
          instrutor_id: user.id,
          titulo: title,
          descricao: description || null,
          tipo,
          file_url: urlData.publicUrl,
          file_path: filePath,
        });

      if (dbError) throw dbError;

      toast({ title: "Sucesso!", description: "Material enviado com sucesso." });
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
        <CardDescription>Envie PDFs, vídeos ou outros arquivos para seus alunos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="title">Título do Material</Label>
            <Input id="title" placeholder="Ex: Aula sobre Direção Defensiva" value={title} onChange={(e) => setTitle(e.target.value)} disabled={uploading} />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Descrição breve do material" value={description} onChange={(e) => setDescription(e.target.value)} disabled={uploading} />
          </div>
          <div>
            <Label htmlFor="file">Selecionar Arquivo</Label>
            <Input ref={fileInputRef} id="file" type="file" disabled={uploading} accept=".pdf,.mp4,.mov,.avi,.jpg,.png,.doc,.docx" />
          </div>
          <Button type="submit" disabled={uploading || !title} className="w-full">
            {uploading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>) : (<><Upload className="w-4 h-4 mr-2" />Enviar Material</>)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

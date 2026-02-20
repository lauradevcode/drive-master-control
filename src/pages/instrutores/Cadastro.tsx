import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Upload,
  FileText,
  User,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ESTADOS_BR = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

interface UploadedDoc {
  tipo: "documento_foto" | "comprovante_credenciamento" | "documento_veiculo";
  file: File | null;
  url: string | null;
  uploading: boolean;
}

export default function CadastroInstrutor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    cpf: "",
    credenciamento_numero: "",
    cidade: "",
    estado: "",
    categoria: "",
    tipo_veiculo: "",
    valor_aula: "",
    whatsapp: "",
    descricao: "",
    photo_url: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [_uploadingPhoto, setUploadingPhoto] = useState(false);

  const [docs, setDocs] = useState<UploadedDoc[]>([
    { tipo: "documento_foto", file: null, url: null, uploading: false },
    { tipo: "comprovante_credenciamento", file: null, url: null, uploading: false },
    { tipo: "documento_veiculo", file: null, url: null, uploading: false },
  ]);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return form.photo_url || null;
    setUploadingPhoto(true);
    const ext = photoFile.name.split(".").pop();
    const path = `fotos/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("instrutores")
      .upload(path, photoFile, { upsert: true });
    setUploadingPhoto(false);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao fazer upload da foto." });
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from("instrutores").getPublicUrl(path);
    return publicUrl;
  };

  const uploadDoc = async (index: number) => {
    const doc = docs[index];
    if (!doc.file) return;
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, uploading: true } : d)));
    const ext = doc.file.name.split(".").pop();
    const path = `documentos/${doc.tipo}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("instrutores")
      .upload(path, doc.file, { upsert: true });
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: `Falha ao enviar ${doc.tipo}.` });
      setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, uploading: false } : d)));
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("instrutores").getPublicUrl(path);
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, url: publicUrl, uploading: false } : d)));
  };

  const handleDocChange = (index: number, file: File) => {
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, file } : d)));
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.cidade || !form.estado || !form.categoria || !form.tipo_veiculo || !form.whatsapp) {
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios." });
      return;
    }
    const docFoto = docs[0];
    const docCred = docs[1];
    if (!docFoto.url && !docFoto.file) {
      toast({ variant: "destructive", title: "Documento obrigatório", description: "Envie o documento com foto." });
      return;
    }
    if (!docCred.url && !docCred.file) {
      toast({ variant: "destructive", title: "Documento obrigatório", description: "Envie o comprovante de credenciamento." });
      return;
    }

    setSubmitting(true);

    // Upload photo
    const photoUrl = await uploadPhoto();

    // Upload pending docs
    const updatedDocs = [...docs];
    for (let i = 0; i < updatedDocs.length; i++) {
      if (updatedDocs[i].file && !updatedDocs[i].url) {
        await uploadDoc(i);
      }
    }

    // Refresh docs state
    const finalDocs = docs;

    // Insert instrutor
    const { data: instrutorData, error: instrutorError } = await supabase
      .from("instrutores")
      .insert({
        full_name: form.full_name.trim(),
        cpf: form.cpf.trim() || null,
        credenciamento_numero: form.credenciamento_numero.trim() || null,
        cidade: form.cidade.trim(),
        estado: form.estado,
        categoria: form.categoria as any,
        tipo_veiculo: form.tipo_veiculo as any,
        valor_aula: form.valor_aula ? parseFloat(form.valor_aula.replace(",", ".")) : null,
        whatsapp: form.whatsapp.trim(),
        descricao: form.descricao.trim() || null,
        photo_url: photoUrl,
        status: "pendente",
      } as any)
      .select("id")
      .single();

    if (instrutorError || !instrutorData) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível cadastrar. Tente novamente." });
      setSubmitting(false);
      return;
    }

    // Insert documentos
    const docsToInsert = finalDocs
      .filter((d) => d.url)
      .map((d) => ({
        instrutor_id: (instrutorData as any).id,
        tipo: d.tipo,
        url: d.url!,
        nome_arquivo: d.file?.name ?? d.tipo,
      }));

    if (docsToInsert.length > 0) {
      await supabase.from("documentos_instrutor").insert(docsToInsert as any);
    }

    setSuccess(true);
    setSubmitting(false);
  };

  const docLabels = {
    documento_foto: { label: "Documento com foto (RG / CNH)", required: true },
    comprovante_credenciamento: { label: "Comprovante de credenciamento (DETRAN)", required: true },
    documento_veiculo: { label: "Documento do veículo (CRLV)", required: false },
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md border-0 shadow-xl text-center">
          <CardContent className="p-10 space-y-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Cadastro enviado!</h2>
            <p className="text-muted-foreground">
              Seu cadastro foi recebido e está em análise. Nossa equipe irá verificar seus documentos
              e em breve você receberá um retorno.
            </p>
            <Badge className="bg-warning/10 text-warning border-warning/20">
              Status: Pendente de aprovação
            </Badge>
            <div className="pt-2">
              <Link to="/instrutores">
                <Button variant="outline" className="w-full">Ver marketplace</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/instrutores")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Cadastro de Instrutor</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s === 1 ? "Dados pessoais" : s === 2 ? "Perfil profissional" : "Documentos"}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Dados pessoais */}
        {step === 1 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>Informações básicas do instrutor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Foto */}
              <div className="space-y-2">
                <Label>Foto de perfil</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <label htmlFor="photo" className="cursor-pointer">
                    <div className="flex items-center gap-2 border border-dashed rounded-lg px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                      <Upload className="w-4 h-4" />
                      Selecionar foto
                    </div>
                    <input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="full_name">Nome completo *</Label>
                <Input id="full_name" value={form.full_name} onChange={(e) => updateForm("full_name", e.target.value)} placeholder="Seu nome completo" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cpf">CPF *</Label>
                <Input id="cpf" value={form.cpf} onChange={(e) => updateForm("cpf", e.target.value)} placeholder="000.000.000-00" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input id="whatsapp" value={form.whatsapp} onChange={(e) => updateForm("whatsapp", e.target.value)} placeholder="(11) 99999-9999" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" value={form.cidade} onChange={(e) => updateForm("cidade", e.target.value)} placeholder="Sua cidade" />
                </div>
                <div className="space-y-1.5">
                  <Label>Estado *</Label>
                  <Select value={form.estado} onValueChange={(v) => updateForm("estado", v)}>
                    <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BR.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  if (!form.full_name || !form.cpf || !form.whatsapp || !form.cidade || !form.estado) {
                    toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha todos os campos marcados com *." });
                    return;
                  }
                  setStep(2);
                }}
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Perfil profissional */}
        {step === 2 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Perfil Profissional
              </CardTitle>
              <CardDescription>Suas credenciais e informações de ensino</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="credenciamento">Número de credenciamento *</Label>
                <Input id="credenciamento" value={form.credenciamento_numero} onChange={(e) => updateForm("credenciamento_numero", e.target.value)} placeholder="Número DETRAN ou equivalente" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Categoria *</Label>
                  <Select value={form.categoria} onValueChange={(v) => updateForm("categoria", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A — Motocicleta</SelectItem>
                      <SelectItem value="B">B — Automóvel</SelectItem>
                      <SelectItem value="AB">AB — Moto e Carro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de veículo *</Label>
                  <Select value={form.tipo_veiculo} onValueChange={(v) => updateForm("tipo_veiculo", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automático">Automático</SelectItem>
                      <SelectItem value="Ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="valor">Valor por aula (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="valor" className="pl-9" value={form.valor_aula} onChange={(e) => updateForm("valor_aula", e.target.value)} placeholder="Ex: 120,00" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="descricao">Descrição profissional</Label>
                <Textarea
                  id="descricao"
                  rows={4}
                  value={form.descricao}
                  onChange={(e) => updateForm("descricao", e.target.value)}
                  placeholder="Conte um pouco sobre sua experiência, diferenciais e método de ensino..."
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Voltar</Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!form.credenciamento_numero || !form.categoria || !form.tipo_veiculo) {
                      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha todos os campos marcados com *." });
                      return;
                    }
                    setStep(3);
                  }}
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Documentos */}
        {step === 3 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Documentos
              </CardTitle>
              <CardDescription>Envie os documentos obrigatórios para verificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {docs.map((doc, index) => {
                const { label, required } = docLabels[doc.tipo];
                return (
                  <div key={doc.tipo} className="space-y-1.5">
                    <Label>
                      {label} {required && <span className="text-destructive">*</span>}
                      {!required && <span className="text-muted-foreground text-xs ml-1">(opcional)</span>}
                    </Label>
                    {doc.url ? (
                      <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent font-medium">Arquivo enviado</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-7 text-xs"
                          onClick={() => setDocs((prev) => prev.map((d, i) => i === index ? { ...d, url: null, file: null } : d))}
                        >
                          Trocar
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label htmlFor={`doc-${index}`} className="cursor-pointer block">
                          <div className={`flex items-center gap-2 border-2 border-dashed rounded-lg px-4 py-4 text-sm transition-colors
                            ${doc.file ? "border-primary/40 bg-primary/5 text-primary" : "border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"}`}>
                            <Upload className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                              {doc.file ? doc.file.name : "Selecionar arquivo (JPG, PNG ou PDF)"}
                            </span>
                          </div>
                          <input
                            id={`doc-${index}`}
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleDocChange(index, f);
                            }}
                          />
                        </label>
                        {doc.file && !doc.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={doc.uploading}
                            onClick={() => uploadDoc(index)}
                          >
                            {doc.uploading ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Enviando...</> : "Enviar arquivo"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Voltar</Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                  ) : "Enviar Cadastro"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}


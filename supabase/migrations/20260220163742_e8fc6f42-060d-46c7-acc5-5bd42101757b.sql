
-- ============================================================
-- MARKETPLACE DE INSTRUTORES
-- ============================================================

-- 1. Tabela principal de instrutores
CREATE TABLE public.instrutores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  cpf TEXT,
  credenciamento_numero TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('A', 'B', 'AB')),
  tipo_veiculo TEXT NOT NULL CHECK (tipo_veiculo IN ('Manual', 'Automático', 'Ambos')),
  valor_aula NUMERIC(10, 2),
  whatsapp TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Tabela de documentos do instrutor
CREATE TABLE public.documentos_instrutor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instrutor_id UUID NOT NULL REFERENCES public.instrutores(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('documento_foto', 'comprovante_credenciamento', 'documento_veiculo')),
  url TEXT NOT NULL,
  nome_arquivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Tabela de solicitações de aula
CREATE TABLE public.solicitacoes_aula (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instrutor_id UUID NOT NULL REFERENCES public.instrutores(id) ON DELETE CASCADE,
  nome_aluno TEXT NOT NULL,
  telefone TEXT NOT NULL,
  melhor_horario TEXT,
  observacao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'contato_feito', 'confirmado', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Habilitar RLS
ALTER TABLE public.instrutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_instrutor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_aula ENABLE ROW LEVEL SECURITY;

-- 5. RLS: instrutores
-- Qualquer pessoa pode ver instrutores aprovados (marketplace público)
CREATE POLICY "Qualquer um pode ver instrutores aprovados"
  ON public.instrutores FOR SELECT
  USING (status = 'aprovado');

-- Admin pode ver todos
CREATE POLICY "Admin pode ver todos os instrutores"
  ON public.instrutores FOR SELECT
  USING (public.is_admin());

-- Admin pode atualizar status
CREATE POLICY "Admin pode atualizar instrutores"
  ON public.instrutores FOR UPDATE
  USING (public.is_admin());

-- Qualquer um pode inserir (cadastro público)
CREATE POLICY "Qualquer um pode se cadastrar como instrutor"
  ON public.instrutores FOR INSERT
  WITH CHECK (true);

-- Instrutor pode atualizar seu próprio perfil (exceto status)
CREATE POLICY "Instrutor pode atualizar seu perfil"
  ON public.instrutores FOR UPDATE
  USING (user_id = auth.uid() AND NOT public.is_admin());

-- 6. RLS: documentos_instrutor
-- Admin pode ver todos os documentos
CREATE POLICY "Admin pode ver todos os documentos"
  ON public.documentos_instrutor FOR SELECT
  USING (public.is_admin());

-- Instrutor pode ver seus próprios documentos
CREATE POLICY "Instrutor pode ver seus documentos"
  ON public.documentos_instrutor FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.instrutores
      WHERE id = instrutor_id AND user_id = auth.uid()
    )
  );

-- Qualquer um pode inserir documentos (para o fluxo de cadastro)
CREATE POLICY "Qualquer um pode enviar documentos"
  ON public.documentos_instrutor FOR INSERT
  WITH CHECK (true);

-- 7. RLS: solicitacoes_aula
-- Qualquer um pode inserir solicitação (aluno sem login)
CREATE POLICY "Qualquer um pode solicitar aula"
  ON public.solicitacoes_aula FOR INSERT
  WITH CHECK (true);

-- Admin pode ver todas as solicitações
CREATE POLICY "Admin pode ver todas as solicitacoes"
  ON public.solicitacoes_aula FOR SELECT
  USING (public.is_admin());

-- Admin pode atualizar status de solicitações
CREATE POLICY "Admin pode atualizar solicitacoes"
  ON public.solicitacoes_aula FOR UPDATE
  USING (public.is_admin());

-- 8. Trigger updated_at para instrutores
CREATE TRIGGER update_instrutores_updated_at
  BEFORE UPDATE ON public.instrutores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Storage bucket para fotos e documentos de instrutores
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'instrutores',
  'instrutores',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Storage policies
CREATE POLICY "Fotos de instrutores são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'instrutores');

CREATE POLICY "Qualquer um pode fazer upload de documentos de instrutor"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'instrutores');

CREATE POLICY "Admin pode deletar arquivos de instrutores"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'instrutores' AND public.is_admin());

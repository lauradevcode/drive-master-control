
-- 1. Tabela materiais (substitui o hack localStorage)
CREATE TABLE public.materiais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instrutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT CHECK (tipo IN ('pdf','video','outro')),
  file_url TEXT,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;

-- 2. Tabela matriculas
CREATE TABLE public.matriculas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instrutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progresso INTEGER DEFAULT 0,
  aulas_concluidas INTEGER DEFAULT 0,
  total_aulas INTEGER DEFAULT 30,
  horas_estudo INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;

-- 3. Tabela simulados
CREATE TABLE public.simulados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nota INTEGER,
  acertos INTEGER,
  total_questoes INTEGER DEFAULT 30,
  tempo_segundos INTEGER,
  aprovado BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.simulados ENABLE ROW LEVEL SECURITY;

-- 4. Tabela agendamentos
CREATE TABLE public.agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instrutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_hora TIMESTAMPTZ,
  status TEXT CHECK (status IN ('pendente','confirmado','concluido','cancelado')) DEFAULT 'pendente',
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- 5. Tabela assinaturas (painel financeiro admin)
CREATE TABLE public.assinaturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  autoescola_nome TEXT NOT NULL,
  plano TEXT CHECK (plano IN ('starter','profissional','premium')),
  valor DECIMAL(10,2),
  status TEXT CHECK (status IN ('trial','ativo','atrasado','cancelado')) DEFAULT 'trial',
  trial_inicio TIMESTAMPTZ DEFAULT NOW(),
  trial_fim TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  proximo_vencimento TIMESTAMPTZ,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

-- ========== RLS POLICIES ==========

-- materiais: instrutor gerencia os seus, aluno vê do seu instrutor, admin vê tudo
CREATE POLICY "instrutor_manage_materiais" ON public.materiais
  FOR ALL USING (auth.uid() = instrutor_id);

CREATE POLICY "aluno_ve_materiais" ON public.materiais
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.matriculas WHERE aluno_id = auth.uid() AND matriculas.instrutor_id = materiais.instrutor_id)
  );

CREATE POLICY "admin_all_materiais" ON public.materiais
  FOR ALL USING (public.is_admin());

-- matriculas
CREATE POLICY "aluno_ve_matricula" ON public.matriculas
  FOR SELECT USING (auth.uid() = aluno_id);

CREATE POLICY "instrutor_manage_matriculas" ON public.matriculas
  FOR ALL USING (auth.uid() = instrutor_id);

CREATE POLICY "admin_all_matriculas" ON public.matriculas
  FOR ALL USING (public.is_admin());

-- simulados: aluno gerencia os seus, admin vê tudo
CREATE POLICY "aluno_manage_simulados" ON public.simulados
  FOR ALL USING (auth.uid() = aluno_id);

CREATE POLICY "instrutor_ve_simulados_alunos" ON public.simulados
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.matriculas WHERE matriculas.instrutor_id = auth.uid() AND matriculas.aluno_id = simulados.aluno_id)
  );

CREATE POLICY "admin_all_simulados" ON public.simulados
  FOR ALL USING (public.is_admin());

-- agendamentos
CREATE POLICY "aluno_ve_agendamentos" ON public.agendamentos
  FOR SELECT USING (auth.uid() = aluno_id);

CREATE POLICY "aluno_insert_agendamento" ON public.agendamentos
  FOR INSERT WITH CHECK (auth.uid() = aluno_id);

CREATE POLICY "instrutor_manage_agendamentos" ON public.agendamentos
  FOR ALL USING (auth.uid() = instrutor_id);

CREATE POLICY "admin_all_agendamentos" ON public.agendamentos
  FOR ALL USING (public.is_admin());

-- assinaturas: somente admin
CREATE POLICY "admin_all_assinaturas" ON public.assinaturas
  FOR ALL USING (public.is_admin());

-- ========== Storage bucket para materiais ==========
INSERT INTO storage.buckets (id, name, public) VALUES ('materiais', 'materiais', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "instrutor_upload_materiais" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'materiais' AND auth.role() = 'authenticated');

CREATE POLICY "anyone_read_materiais" ON storage.objects
  FOR SELECT USING (bucket_id = 'materiais');

CREATE POLICY "instrutor_delete_materiais" ON storage.objects
  FOR DELETE USING (bucket_id = 'materiais' AND auth.role() = 'authenticated');

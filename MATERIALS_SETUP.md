# 📚 Sistema de Materiais - Instrutor para Aluno

## Setup Necessário

### 1. Criar Tabela no Supabase

Execute o SQL abaixo no **Lovable Cloud > SQL Editor**:

```sql
-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_materials_uploaded_by ON materials(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at);

-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view materials"
  ON materials
  FOR SELECT
  USING (true);

CREATE POLICY "Instructors can insert materials"
  ON materials
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin', 'instrutor')
    )
  );

CREATE POLICY "Users can only delete their own materials"
  ON materials
  FOR DELETE
  USING (
    uploaded_by = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );
```

### 2. Criar Storage Bucket

No Supabase Dashboard:
- Vá para **Storage** > **Buckets**
- Clique em **Create New Bucket**
- Nome: `materials`
- Marque **Public bucket**
- Clique **Create**

### 3. Adicionar Políticas de Storage

No SQL Editor, execute:

```sql
-- Create storage policies
CREATE POLICY "Anyone can view materials"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'materials');

CREATE POLICY "Instructors can upload materials"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'materials' 
    AND EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin', 'instrutor')
    )
  );

CREATE POLICY "Users can delete their own materials"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'materials'
    AND (
      owner = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
      )
    )
  );
```

## Como Usar

### Para Instrutor:
1. Acesse http://localhost:8081/instrutor
2. Vá para a seção "Upload de Material"
3. Preencha:
   - **Título**: Nome do material
   - **Descrição**: Breve descrição
   - **Arquivo**: Selecione PDF, vídeo ou documento
4. Clique em "Enviar Material"
5. O material aparecerá na lista abaixo

### Para Aluno:
1. Acesse http://localhost:8081/dashboard
2. Desça até a seção "Materiais Disponíveis"
3. Veja todos os materiais enviados pelos instrutores
4. Clique no ícone de download para baixar

## Arquivos Suportados

- **Documentos**: PDF, DOC, DOCX
- **Imagens**: JPG, PNG
- **Vídeos**: MP4, MOV, AVI

## Arquitetura

```
Instrutor
   ↓
MaterialsUpload (Enviar arquivo para Supabase Storage)
   ↓
Tabela 'materials' (Registrar metadata)
   ↓
Aluno
   ↓
MaterialsList (Listar todos os materiais)
   ↓
Download/Visualização
```

## Troubleshooting

### "Erro ao enviar material"
- Verifique se você tem role "instrutor" no banco de dados
- Execute: `SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID';`

### "Bucket não encontrado"
- Certifique-se de que o bucket `materials` foi criado
- Verifique as políticas de RLS

### Arquivo não aparece para aluno
- Aguarde alguns segundos após upload
- Recarregue a página (F5)
- Verifique se as políticas de storage foram criadas

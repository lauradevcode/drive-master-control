export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          aluno_id: string
          created_at: string | null
          data_hora: string | null
          id: string
          instrutor_id: string
          observacao: string | null
          status: string | null
        }
        Insert: {
          aluno_id: string
          created_at?: string | null
          data_hora?: string | null
          id?: string
          instrutor_id: string
          observacao?: string | null
          status?: string | null
        }
        Update: {
          aluno_id?: string
          created_at?: string | null
          data_hora?: string | null
          id?: string
          instrutor_id?: string
          observacao?: string | null
          status?: string | null
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          admin_id: string | null
          autoescola_nome: string
          created_at: string | null
          id: string
          plano: string | null
          proximo_vencimento: string | null
          status: string | null
          trial_fim: string | null
          trial_inicio: string | null
          valor: number | null
        }
        Insert: {
          admin_id?: string | null
          autoescola_nome: string
          created_at?: string | null
          id?: string
          plano?: string | null
          proximo_vencimento?: string | null
          status?: string | null
          trial_fim?: string | null
          trial_inicio?: string | null
          valor?: number | null
        }
        Update: {
          admin_id?: string | null
          autoescola_nome?: string
          created_at?: string | null
          id?: string
          plano?: string | null
          proximo_vencimento?: string | null
          status?: string | null
          trial_fim?: string | null
          trial_inicio?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      documentos_instrutor: {
        Row: {
          created_at: string
          id: string
          instrutor_id: string
          nome_arquivo: string | null
          tipo: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          instrutor_id: string
          nome_arquivo?: string | null
          tipo: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          instrutor_id?: string
          nome_arquivo?: string | null
          tipo?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_instrutor_instrutor_id_fkey"
            columns: ["instrutor_id"]
            isOneToOne: false
            referencedRelation: "instrutores"
            referencedColumns: ["id"]
          },
        ]
      }
      instrutores: {
        Row: {
          categoria: string
          cidade: string
          cpf: string | null
          created_at: string
          credenciamento_numero: string | null
          descricao: string | null
          estado: string
          full_name: string
          id: string
          photo_url: string | null
          status: string
          tipo_veiculo: string
          updated_at: string
          user_id: string | null
          valor_aula: number | null
          whatsapp: string
        }
        Insert: {
          categoria: string
          cidade: string
          cpf?: string | null
          created_at?: string
          credenciamento_numero?: string | null
          descricao?: string | null
          estado: string
          full_name: string
          id?: string
          photo_url?: string | null
          status?: string
          tipo_veiculo: string
          updated_at?: string
          user_id?: string | null
          valor_aula?: number | null
          whatsapp: string
        }
        Update: {
          categoria?: string
          cidade?: string
          cpf?: string | null
          created_at?: string
          credenciamento_numero?: string | null
          descricao?: string | null
          estado?: string
          full_name?: string
          id?: string
          photo_url?: string | null
          status?: string
          tipo_veiculo?: string
          updated_at?: string
          user_id?: string | null
          valor_aula?: number | null
          whatsapp?: string
        }
        Relationships: []
      }
      materiais: {
        Row: {
          created_at: string | null
          descricao: string | null
          file_path: string | null
          file_url: string | null
          id: string
          instrutor_id: string
          tipo: string | null
          titulo: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          instrutor_id: string
          tipo?: string | null
          titulo: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          instrutor_id?: string
          tipo?: string | null
          titulo?: string
        }
        Relationships: []
      }
      matriculas: {
        Row: {
          aluno_id: string
          aulas_concluidas: number | null
          created_at: string | null
          horas_estudo: number | null
          id: string
          instrutor_id: string
          progresso: number | null
          total_aulas: number | null
        }
        Insert: {
          aluno_id: string
          aulas_concluidas?: number | null
          created_at?: string | null
          horas_estudo?: number | null
          id?: string
          instrutor_id: string
          progresso?: number | null
          total_aulas?: number | null
        }
        Update: {
          aluno_id?: string
          aulas_concluidas?: number | null
          created_at?: string | null
          horas_estudo?: number | null
          id?: string
          instrutor_id?: string
          progresso?: number | null
          total_aulas?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      simulados: {
        Row: {
          acertos: number | null
          aluno_id: string
          aprovado: boolean | null
          created_at: string | null
          id: string
          nota: number | null
          tempo_segundos: number | null
          total_questoes: number | null
        }
        Insert: {
          acertos?: number | null
          aluno_id: string
          aprovado?: boolean | null
          created_at?: string | null
          id?: string
          nota?: number | null
          tempo_segundos?: number | null
          total_questoes?: number | null
        }
        Update: {
          acertos?: number | null
          aluno_id?: string
          aprovado?: boolean | null
          created_at?: string | null
          id?: string
          nota?: number | null
          tempo_segundos?: number | null
          total_questoes?: number | null
        }
        Relationships: []
      }
      solicitacoes_aula: {
        Row: {
          created_at: string
          id: string
          instrutor_id: string
          melhor_horario: string | null
          nome_aluno: string
          observacao: string | null
          status: string
          telefone: string
        }
        Insert: {
          created_at?: string
          id?: string
          instrutor_id: string
          melhor_horario?: string | null
          nome_aluno: string
          observacao?: string | null
          status?: string
          telefone: string
        }
        Update: {
          created_at?: string
          id?: string
          instrutor_id?: string
          melhor_horario?: string | null
          nome_aluno?: string
          observacao?: string | null
          status?: string
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_aula_instrutor_id_fkey"
            columns: ["instrutor_id"]
            isOneToOne: false
            referencedRelation: "instrutores"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active_user: { Args: { _user_id: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "instrutor"
      user_status: "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "instrutor"],
      user_status: ["active", "inactive"],
    },
  },
} as const

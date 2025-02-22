export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      class_subjects: {
        Row: {
          class_id: string
          subject_name: string
          user_id: string
        }
        Insert: {
          class_id: string
          subject_name: string
          user_id: string
        }
        Update: {
          class_id?: string
          subject_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          id: string
          is_lab: boolean | null
          lab_duration: number | null
          lectures_per_week: number | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_lab?: boolean | null
          lab_duration?: number | null
          lectures_per_week?: number | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_lab?: boolean | null
          lab_duration?: number | null
          lectures_per_week?: number | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_subjects: {
        Row: {
          subject_name: string
          teacher_id: string
          user_id: string
        }
        Insert: {
          subject_name: string
          teacher_id: string
          user_id: string
        }
        Update: {
          subject_name?: string
          teacher_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          id: string
          name: string
          preferred_end_time: string | null
          preferred_hours: number | null
          preferred_start_time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          preferred_end_time?: string | null
          preferred_hours?: number | null
          preferred_start_time?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          preferred_end_time?: string | null
          preferred_hours?: number | null
          preferred_start_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      timetable_settings: {
        Row: {
          end_time: string
          first_break_duration: number
          first_break_start: string
          lecture_length: number
          lunch_break_duration: number
          lunch_break_start: string
          second_break_duration: number
          second_break_start: string
          start_time: string
          user_id: string
        }
        Insert: {
          end_time?: string
          first_break_duration?: number
          first_break_start?: string
          lecture_length?: number
          lunch_break_duration?: number
          lunch_break_start?: string
          second_break_duration?: number
          second_break_start?: string
          start_time?: string
          user_id: string
        }
        Update: {
          end_time?: string
          first_break_duration?: number
          first_break_start?: string
          lecture_length?: number
          lunch_break_duration?: number
          lunch_break_start?: string
          second_break_duration?: number
          second_break_start?: string
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

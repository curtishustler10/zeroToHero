export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          checking_balance: number;
          created_at: string;
          currency: string;
          id: string;
          savings_balance: number;
          user_id: string;
        };
        Insert: {
          checking_balance?: number;
          created_at?: string;
          currency: string;
          id?: string;
          savings_balance?: number;
          user_id: string;
        };
        Update: {
          checking_balance?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          savings_balance?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      account_transactions: {
        Row: {
          account_type: string;
          amount: number;
          created_at: string;
          date: string;
          id: string;
          label: string | null;
          note: string | null;
          user_id: string;
        };
        Insert: {
          account_type: string;
          amount: number;
          created_at?: string;
          date: string;
          id?: string;
          label?: string | null;
          note?: string | null;
          user_id: string;
        };
        Update: {
          account_type?: string;
          amount?: number;
          created_at?: string;
          date?: string;
          id?: string;
          label?: string | null;
          note?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "account_transactions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      body_measurements: {
        Row: {
          bodyfat_percent: number | null;
          created_at: string;
          date: string;
          id: string;
          notes: string | null;
          waist_cm: number | null;
          weight_kg: number | null;
          user_id: string;
        };
        Insert: {
          bodyfat_percent?: number | null;
          created_at?: string;
          date: string;
          id?: string;
          notes?: string | null;
          waist_cm?: number | null;
          weight_kg?: number | null;
          user_id: string;
        };
        Update: {
          bodyfat_percent?: number | null;
          created_at?: string;
          date?: string;
          id?: string;
          notes?: string | null;
          waist_cm?: number | null;
          weight_kg?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "body_measurements_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bucket_items: {
        Row: {
          category: string;
          created_at: string;
          done_date: string | null;
          id: string;
          notes: string | null;
          status: string;
          title: string;
          user_id: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          done_date?: string | null;
          id?: string;
          notes?: string | null;
          status?: string;
          title: string;
          user_id: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          done_date?: string | null;
          id?: string;
          notes?: string | null;
          status?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bucket_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_checkins: {
        Row: {
          created_at: string;
          date: string;
          gym_done: boolean;
          id: string;
          meditation_minutes: number;
          notes: string | null;
          nuts_free: boolean;
          sleep_hours: number | null;
          smoke_free: boolean;
          weed_free: boolean;
          weight_kg: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          gym_done?: boolean;
          id?: string;
          meditation_minutes?: number;
          notes?: string | null;
          nuts_free?: boolean;
          sleep_hours?: number | null;
          smoke_free?: boolean;
          weed_free?: boolean;
          weight_kg?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          gym_done?: boolean;
          id?: string;
          meditation_minutes?: number;
          notes?: string | null;
          nuts_free?: boolean;
          sleep_hours?: number | null;
          smoke_free?: boolean;
          weed_free?: boolean;
          weight_kg?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_checkins_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_history_cache: {
        Row: {
          exercise_id: string;
          id: string;
          last_date: string | null;
          last_reps: number | null;
          last_weight_kg: number | null;
          user_id: string;
        };
        Insert: {
          exercise_id: string;
          id?: string;
          last_date?: string | null;
          last_reps?: number | null;
          last_weight_kg?: number | null;
          user_id: string;
        };
        Update: {
          exercise_id?: string;
          id?: string;
          last_date?: string | null;
          last_reps?: number | null;
          last_weight_kg?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_history_cache_exercise_id_fkey";
            columns: ["exercise_id"];
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_history_cache_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      exercises: {
        Row: {
          created_at: string;
          equipment: string | null;
          id: string;
          illustration_uri: string | null;
          instructions: Json | null;
          name: string;
          notes: string | null;
          primary_muscles: string[] | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          equipment?: string | null;
          id?: string;
          illustration_uri?: string | null;
          instructions?: Json | null;
          name: string;
          notes?: string | null;
          primary_muscles?: string[] | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          equipment?: string | null;
          id?: string;
          illustration_uri?: string | null;
          instructions?: Json | null;
          name?: string;
          notes?: string | null;
          primary_muscles?: string[] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercises_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          created_at: string;
          current_value: number | null;
          deadline: string | null;
          id: string;
          name: string;
          notes: string | null;
          start_date: string;
          target_value: number;
          tracking_source: string | null;
          type: string;
          unit: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_value?: number | null;
          deadline?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          start_date?: string;
          target_value: number;
          tracking_source?: string | null;
          type: string;
          unit?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_value?: number | null;
          deadline?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          start_date?: string;
          target_value?: number;
          tracking_source?: string | null;
          type?: string;
          unit?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      journal_entries: {
        Row: {
          created_at: string;
          date: string;
          energy_tag: string | null;
          entry_text: string;
          id: string;
          mood_tag: string | null;
          tags: string[] | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          energy_tag?: string | null;
          entry_text: string;
          id?: string;
          mood_tag?: string | null;
          tags?: string[] | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          energy_tag?: string | null;
          entry_text?: string;
          id?: string;
          mood_tag?: string | null;
          tags?: string[] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      journal_scans: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          image_uri: string;
          notes: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          image_uri: string;
          notes?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          image_uri?: string;
          notes?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journal_scans_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      memories: {
        Row: {
          bucket_item_id: string;
          caption: string | null;
          completed_at: string;
          created_at: string;
          id: string;
          location: string | null;
          photo_uri: string;
          title: string;
          user_id: string;
        };
        Insert: {
          bucket_item_id: string;
          caption?: string | null;
          completed_at: string;
          created_at?: string;
          id?: string;
          location?: string | null;
          photo_uri: string;
          title: string;
          user_id: string;
        };
        Update: {
          bucket_item_id?: string;
          caption?: string | null;
          completed_at?: string;
          created_at?: string;
          id?: string;
          location?: string | null;
          photo_uri?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memories_bucket_item_id_fkey";
            columns: ["bucket_item_id"];
            referencedRelation: "bucket_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memories_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      program_exercises: {
        Row: {
          created_at: string;
          exercise_id: string;
          id: string;
          notes: string | null;
          order_index: number;
          prescription_reps_max: number | null;
          prescription_reps_min: number | null;
          prescription_rest_sec: number | null;
          prescription_sets: number;
          program_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          exercise_id: string;
          id?: string;
          notes?: string | null;
          order_index: number;
          prescription_reps_max?: number | null;
          prescription_reps_min?: number | null;
          prescription_rest_sec?: number | null;
          prescription_sets: number;
          program_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          exercise_id?: string;
          id?: string;
          notes?: string | null;
          order_index?: number;
          prescription_reps_max?: number | null;
          prescription_reps_min?: number | null;
          prescription_rest_sec?: number | null;
          prescription_sets?: number;
          program_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "program_exercises_exercise_id_fkey";
            columns: ["exercise_id"];
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "program_exercises_program_id_fkey";
            columns: ["program_id"];
            referencedRelation: "training_programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "program_exercises_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      recurring_payment_instances: {
        Row: {
          created_at: string;
          due_date: string;
          id: string;
          paid_at: string | null;
          period_end: string;
          period_start: string;
          recurring_payment_id: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          due_date: string;
          id?: string;
          paid_at?: string | null;
          period_end: string;
          period_start: string;
          recurring_payment_id: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          due_date?: string;
          id?: string;
          paid_at?: string | null;
          period_end?: string;
          period_start?: string;
          recurring_payment_id?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recurring_payment_instances_recurring_payment_id_fkey";
            columns: ["recurring_payment_id"];
            referencedRelation: "recurring_payments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recurring_payment_instances_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      recurring_payments: {
        Row: {
          active: boolean;
          amount: number;
          created_at: string;
          due_day: number;
          frequency: string;
          id: string;
          last_paid_date: string | null;
          name: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          amount: number;
          created_at?: string;
          due_day: number;
          frequency: string;
          id?: string;
          last_paid_date?: string | null;
          name: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          amount?: number;
          created_at?: string;
          due_day?: number;
          frequency?: string;
          id?: string;
          last_paid_date?: string | null;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recurring_payments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      training_programs: {
        Row: {
          created_at: string;
          description: string | null;
          focus_tags: string[] | null;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          focus_tags?: string[] | null;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          focus_tags?: string[] | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "training_programs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      workout_exercises: {
        Row: {
          created_at: string;
          exercise_id: string;
          id: string;
          order_index: number;
          planned_sets: number;
          user_id: string;
          workout_id: string;
        };
        Insert: {
          created_at?: string;
          exercise_id: string;
          id?: string;
          order_index: number;
          planned_sets: number;
          user_id: string;
          workout_id: string;
        };
        Update: {
          created_at?: string;
          exercise_id?: string;
          id?: string;
          order_index?: number;
          planned_sets?: number;
          user_id?: string;
          workout_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey";
            columns: ["exercise_id"];
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workout_exercises_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey";
            columns: ["workout_id"];
            referencedRelation: "workouts";
            referencedColumns: ["id"];
          },
        ];
      };
      workout_sets: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          is_done: boolean;
          previous_kg: number | null;
          previous_reps: number | null;
          reps: number | null;
          set_number: number;
          user_id: string;
          weight_kg: number | null;
          workout_exercise_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          is_done?: boolean;
          previous_kg?: number | null;
          previous_reps?: number | null;
          reps?: number | null;
          set_number: number;
          user_id: string;
          weight_kg?: number | null;
          workout_exercise_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          is_done?: boolean;
          previous_kg?: number | null;
          previous_reps?: number | null;
          reps?: number | null;
          set_number?: number;
          user_id?: string;
          weight_kg?: number | null;
          workout_exercise_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workout_sets_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workout_sets_workout_exercise_id_fkey";
            columns: ["workout_exercise_id"];
            referencedRelation: "workout_exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      workouts: {
        Row: {
          created_at: string;
          duration_sec: number | null;
          ended_at: string | null;
          id: string;
          notes: string | null;
          program_id: string | null;
          started_at: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          duration_sec?: number | null;
          ended_at?: string | null;
          id?: string;
          notes?: string | null;
          program_id?: string | null;
          started_at: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          duration_sec?: number | null;
          ended_at?: string | null;
          id?: string;
          notes?: string | null;
          program_id?: string | null;
          started_at?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workouts_program_id_fkey";
            columns: ["program_id"];
            referencedRelation: "training_programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workouts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

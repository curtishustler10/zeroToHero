export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          tz: string
          display_name: string | null
          goal_desc: string | null
        }
        Insert: {
          id: string
          created_at?: string
          tz?: string
          display_name?: string | null
          goal_desc?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tz?: string
          display_name?: string | null
          goal_desc?: string | null
        }
      }
      days: {
        Row: {
          id: number
          user_id: string
          date: string
          mood: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          date: string
          mood?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          date?: string
          mood?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: number
          user_id: string
          name: string
          target: number
          unit: string
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          target?: number
          unit?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          target?: number
          unit?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: number
          user_id: string
          habit_id: number
          date: string
          value: number
          created_at: string
        }
        Insert: {
          user_id: string
          habit_id: number
          date: string
          value?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          habit_id?: number
          date?: string
          value?: number
          created_at?: string
        }
      }
      content_logs: {
        Row: {
          id: number
          user_id: string
          date: string
          kind: string
          url: string | null
          caption: string | null
          minutes_spent: number
          created_at: string
        }
        Insert: {
          user_id: string
          date: string
          kind: string
          url?: string | null
          caption?: string | null
          minutes_spent?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          date?: string
          kind?: string
          url?: string | null
          caption?: string | null
          minutes_spent?: number
          created_at?: string
        }
      }
      deepwork_logs: {
        Row: {
          id: number
          user_id: string
          start_time: string
          minutes: number
          tag: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          start_time: string
          minutes: number
          tag?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          start_time?: string
          minutes?: number
          tag?: string | null
          created_at?: string
        }
      }
      social_reps: {
        Row: {
          id: number
          user_id: string
          date: string
          count: number
          notes: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          date: string
          count?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          date?: string
          count?: number
          notes?: string | null
          created_at?: string
        }
      }
      workouts: {
        Row: {
          id: number
          user_id: string
          date: string
          type: string
          duration_min: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          date: string
          type: string
          duration_min?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          date?: string
          type?: string
          duration_min?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      sleep_logs: {
        Row: {
          id: number
          user_id: string
          date: string
          hours: number
          quality: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          date: string
          hours: number
          quality?: number | null
          created_at?: string
        }
        Update: {
          user_id?: string
          date?: string
          hours?: number
          quality?: number | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: number
          user_id: string
          name: string
          business: string | null
          niche: string | null
          source: string | null
          status: string
          priority: number
          next_action_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          business?: string | null
          niche?: string | null
          source?: string | null
          status?: string
          priority?: number
          next_action_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          business?: string | null
          niche?: string | null
          source?: string | null
          status?: string
          priority?: number
          next_action_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      outreach_logs: {
        Row: {
          id: number
          user_id: string
          lead_id: number | null
          date: string
          channel: string
          notes: string | null
          outcome: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          lead_id?: number | null
          date: string
          channel: string
          notes?: string | null
          outcome?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          lead_id?: number | null
          date?: string
          channel?: string
          notes?: string | null
          outcome?: string | null
          created_at?: string
        }
      }
      deals: {
        Row: {
          id: number
          user_id: string
          lead_id: number | null
          amount: number
          cogs: number | null
          date: string
          source: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          lead_id?: number | null
          amount: number
          cogs?: number | null
          date: string
          source?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          lead_id?: number | null
          amount?: number
          cogs?: number | null
          date?: string
          source?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      stories: {
        Row: {
          id: number
          user_id: string
          date: string
          archetype: string
          sensory_detail: string | null
          conflict: string | null
          turning_point: string | null
          lesson: string | null
          draft: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          date: string
          archetype: string
          sensory_detail?: string | null
          conflict?: string | null
          turning_point?: string | null
          lesson?: string | null
          draft?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          date?: string
          archetype?: string
          sensory_detail?: string | null
          conflict?: string | null
          turning_point?: string | null
          lesson?: string | null
          draft?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: number
          user_id: string
          time: string
          name: string
          payload: Json | null
        }
        Insert: {
          user_id: string
          time?: string
          name: string
          payload?: Json | null
        }
        Update: {
          user_id?: string
          time?: string
          name?: string
          payload?: Json | null
        }
      }
      prompts: {
        Row: {
          id: number
          user_id: string | null
          kind: string
          text: string
          weight: number
          created_at: string
        }
        Insert: {
          user_id?: string | null
          kind: string
          text: string
          weight?: number
          created_at?: string
        }
        Update: {
          user_id?: string | null
          kind?: string
          text?: string
          weight?: number
          created_at?: string
        }
      }
    }
    Views: {
      v_daily_score: {
        Row: {
          user_id: string
          date: string
          score: number
        }
      }
      v_funnel: {
        Row: {
          user_id: string
          week: string
          outreach_count: number
          responses: number
          bookings: number
          deals: number
        }
      }
    }
    Functions: {
      create_default_habits: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
      insert_default_prompts: {
        Args: {}
        Returns: void
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
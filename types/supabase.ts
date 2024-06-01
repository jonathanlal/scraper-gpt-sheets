export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cron: {
        Row: {
          created_at: string;
          entries_found: number;
          entries_gpt: number;
          error_msg: string | null;
          id: number;
          time_took: number;
          type: string;
        };
        Insert: {
          created_at?: string;
          entries_found?: number;
          entries_gpt?: number;
          error_msg?: string | null;
          id?: number;
          time_took: number;
          type: string;
        };
        Update: {
          created_at?: string;
          entries_found?: number;
          entries_gpt?: number;
          error_msg?: string | null;
          id?: number;
          time_took?: number;
          type?: string;
        };
        Relationships: [];
      };
      developments: {
        Row: {
          article_content: string | null;
          description: string | null;
          developer: string | null;
          entry_id: number;
          gpt_cost: number | null;
          gpt_viewed: boolean;
          id: number;
          in_sheet: boolean;
          link: string | null;
          location: string | null;
          name_of_development: string;
          number_of_units: string | null;
          published_date: string | null;
          rental_condo: string | null;
          status: string | null;
          title: string | null;
          words: number;
        };
        Insert: {
          article_content?: string | null;
          description?: string | null;
          developer?: string | null;
          entry_id: number;
          gpt_cost?: number | null;
          gpt_viewed?: boolean;
          id?: number;
          in_sheet?: boolean;
          link?: string | null;
          location?: string | null;
          name_of_development: string;
          number_of_units?: string | null;
          published_date?: string | null;
          rental_condo?: string | null;
          status?: string | null;
          title?: string | null;
          words?: number;
        };
        Update: {
          article_content?: string | null;
          description?: string | null;
          developer?: string | null;
          entry_id?: number;
          gpt_cost?: number | null;
          gpt_viewed?: boolean;
          id?: number;
          in_sheet?: boolean;
          link?: string | null;
          location?: string | null;
          name_of_development?: string;
          number_of_units?: string | null;
          published_date?: string | null;
          rental_condo?: string | null;
          status?: string | null;
          title?: string | null;
          words?: number;
        };
        Relationships: [];
      };
      developments_dev: {
        Row: {
          article_content: string | null;
          description: string | null;
          developer: string | null;
          entry_id: number;
          gpt_cost: number | null;
          gpt_viewed: boolean;
          id: number;
          in_sheet: boolean;
          link: string | null;
          location: string | null;
          name_of_development: string;
          number_of_units: string | null;
          published_date: string | null;
          rental_condo: string | null;
          status: string | null;
          title: string | null;
          words: number;
        };
        Insert: {
          article_content?: string | null;
          description?: string | null;
          developer?: string | null;
          entry_id: number;
          gpt_cost?: number | null;
          gpt_viewed?: boolean;
          id?: number;
          in_sheet?: boolean;
          link?: string | null;
          location?: string | null;
          name_of_development: string;
          number_of_units?: string | null;
          published_date?: string | null;
          rental_condo?: string | null;
          status?: string | null;
          title?: string | null;
          words?: number;
        };
        Update: {
          article_content?: string | null;
          description?: string | null;
          developer?: string | null;
          entry_id?: number;
          gpt_cost?: number | null;
          gpt_viewed?: boolean;
          id?: number;
          in_sheet?: boolean;
          link?: string | null;
          location?: string | null;
          name_of_development?: string;
          number_of_units?: string | null;
          published_date?: string | null;
          rental_condo?: string | null;
          status?: string | null;
          title?: string | null;
          words?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;

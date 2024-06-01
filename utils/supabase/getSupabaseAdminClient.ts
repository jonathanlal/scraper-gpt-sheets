import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

export default async function getSupabaseServerAdminClient() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
  return supabase;
}

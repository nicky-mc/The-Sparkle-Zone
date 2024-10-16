import { createClient } from "@supabase/supabase-js";
export default function supabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PASSWORD;

  return createClient(supabaseUrl, supabaseKey);
}

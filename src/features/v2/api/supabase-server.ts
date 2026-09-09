"use server";
import { createClient } from "@supabase/supabase-js";

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server environment variables are not configured");
  }
  console.log("supabaseUrl", supabaseUrl);
  console.log("serviceRoleKey", serviceRoleKey);

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

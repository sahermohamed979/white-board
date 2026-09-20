import { createBrowserClient } from "@supabase/ssr";

function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase browser environment variables are not configured",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | undefined =
  undefined;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }

  return browserClient;
}

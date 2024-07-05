//Supabase Entry Point Data
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://b793-86-8-97-51.ngrok-free.app";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});

//Supabase Entry Point Data
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// if you get this error  Sign-In Error: [AuthRetryableFetchError: Network request failed] then you should run ipconfig in an elevated cmd get the Wireless LAN adapter WiFi: IPv4 Address replace the 127.0.0.1 of supabase with the IPv4

export const supabaseUrl = "http://192.168.0.26:54321";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// export const supabaseUrl = "https://wegvkxkevpqlubdoivum.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlZ3ZreGtldnBxbHViZG9pdnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1MjEwNjMsImV4cCI6MjAzNTA5NzA2M30.CU5_2I3jzi-lsn0rE3CZUQgUw5VZEnMlccIiN77F2vE";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

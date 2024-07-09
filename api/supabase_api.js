import { supabase } from "../api/supabase"; // Adjust path as per your project structure

export const updateUser = async (userId, updates) => {
  const { data, error } = await supabase
    .from("userDatabase")
    .update(updates)
    .eq("userId", userId);

  if (error) {
    throw error;
  }

  return data;
};

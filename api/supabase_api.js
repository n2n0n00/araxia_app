import { Alert } from "react-native";
import { supabase } from "./supabase";

// SIGN UP WITH EMAIL FUNCTION
export async function signUpWithEmail(email, password) {
  try {
    // Sign up the user with Supabase authentication
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      Alert.alert("Error", signUpError.message);
      return { success: false, message: signUpError.message };
    }

    const user = data.user;

    if (!user) {
      Alert.alert("Error", "User signup failed. No user data returned.");
      return {
        success: false,
        message: "User signup failed. No user data returned.",
      };
    }

    // Insert user data into userDatabase table
    const { error: dbError } = await supabase.from("userDatabase").insert([
      {
        userId: user.id,
        email: user.email,
        username: user.email.split("@")[0],
      },
    ]);

    if (dbError) {
      Alert.alert("Error", dbError.message);
      return { success: false, message: dbError.message };
    }

    return { success: true, user };
  } catch (error) {
    Alert.alert("Error", error.message);
    return { success: false, message: error.message };
  }
}

//SIGN IN WITH EMAIL FUNCTION

export async function signInWithEmail(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
      return { success: false, message: error.message };
    }

    const user = data.user;
    if (!user) {
      Alert.alert("Error", "User sign in failed. No user data returned.");
      return {
        success: false,
        message: "User sign in failed. No user data returned.",
      };
    }

    return { success: true, user };
  } catch (error) {
    Alert.alert("Error", error.message);
    return { success: false, message: error.message };
  }
}

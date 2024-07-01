// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import { supabase } from "../api/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then((data) => {
      const session = data.session;
      if (session) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session.user);
          fetchUserData(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setAuthUser(null); // Clear authUser data when signing out
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("userDatabase")
        .select("*")
        .eq("userId", userId)
        .single();

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        setAuthUser({ ...data, id: userId });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      // Sign up the user with Supabase authentication
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
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

      setUser(user);
      fetchUserData(user.id); // Fetch additional user data after sign-up
      return { success: true, user };
    } catch (error) {
      Alert.alert("Error", error.message);
      return { success: false, message: error.message };
    }
  };

  const signInWithEmail = async (email, password) => {
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

      setUser(user);
      fetchUserData(user.id); // Fetch additional user data after sign-in
      return { success: true, user };
    } catch (error) {
      Alert.alert("Error", error.message);
      return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Error", error.message);
        return { success: false, message: error.message };
      }
      setUser(null);
      setAuthUser(null); // Clear authUser data when signing out
      return { success: true };
    } catch (error) {
      Alert.alert("Error", error.message);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signUpWithEmail, signInWithEmail, signOut, authUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

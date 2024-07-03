import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert, Text } from "react-native";
import { supabase } from "../api/supabase";
import { router } from "expo-router";
import WelcomeScreen from "../components/WelcomeScreen/welcome";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      }

      if (data.session) {
        setUser(data.session.user);
        fetchUserData(data.session.user.id);
      }

      setLoading(false);
    };

    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          fetchUserData(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setAuthUser(null);
        }
      }
    );

    return () => {
      authListener?.unsubscribe?.();
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
        console.error("Error fetching user data:", error);
      } else {
        setAuthUser(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
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

      if (user.id) {
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
        fetchUserData(user.id);
      } else {
        Alert.alert("Error", "Invalid user ID.");
        return { success: false, message: "Invalid user ID." };
      }

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
      fetchUserData(user.id);
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
      setAuthUser(null);
      return { success: true };
    } catch (error) {
      Alert.alert("Error", error.message);
      return { success: false, message: error.message };
    }
  };

  const handleWelcomeDone = () => {
    if (user) {
      router.replace("/feed");
    } else {
      router.replace("/(auth)/onboarding");
    }
  };

  if (loading) {
    return <WelcomeScreen onDone={handleWelcomeDone} />;
  }

  return (
    <AuthContext.Provider
      value={{ user, signUpWithEmail, signInWithEmail, signOut, authUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import WelcomeScreen from "../components/WelcomeScreen/WelcomeScreen";
import BgDarkGradient from "../components/BackgroundGradients/BgDarkGradient";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthProvider";
import { router } from "expo-router";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Flag to track component mounting
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true); // Component is mounted

    // Handle back button press to avoid going back to the login screen
    const backAction = () => {
      if (user) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      setIsMounted(false); // Component is unmounted
    };
  }, [user]);

  useEffect(() => {
    if (isMounted && user) {
      router.replace("/feed"); // Navigate to feed after user is authenticated
    } else {
      setLoading(false); // Set loading to false if no user is found
    }
  }, [isMounted, user]);

  const handleWelcomeDone = () => {
    if (isMounted) {
      if (user) {
        router.replace("/feed");
      } else {
        router.replace("/(auth)/onboarding");
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <WelcomeScreen onDone={handleWelcomeDone} />
      </View>
    );
  }

  return (
    <BgDarkGradient>
      <WelcomeScreen onDone={handleWelcomeDone} />
      <StatusBar backgroundColor="#000" style="light" />
    </BgDarkGradient>
  );
}

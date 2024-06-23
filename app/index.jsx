// App.js
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import WelcomeScreen from "../components/WelcomeScreen/welcome";
import Onboarding from "./(auth)/onboarding";
import { SafeAreaView } from "react-native-safe-area-context";
import BgDarkGradient from "../components/BgDarkGradient";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Welcome");

  const handleWelcomeDone = () => {
    //TODO: change this to feed page if the user is logged in
    setCurrentScreen("Onboarding");
  };

  return (
    <BgDarkGradient>
      {currentScreen === "Welcome" && (
        <WelcomeScreen onDone={handleWelcomeDone} />
      )}
      {currentScreen === "Onboarding" && <Onboarding />}
    </BgDarkGradient>
  );
}

import { StatusBar } from "expo-status-bar";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { images } from "../../constants";
import React, { useEffect } from "react";
import BgDarkGradient from "../BgDarkGradient";

const WelcomeScreen = ({ onDone }) => {
  //TODO: should replace this with a loader to wait until the onboarding has loaded if the user is logged out
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <BgDarkGradient>
      <Image source={images.welcomePNG} className="w-screen h-screen" />

      <Image source={images.welcomeLogo} className="absolute" />

      <StatusBar backgroundColor="#161622" style="light" />
    </BgDarkGradient>
  );
};

export default WelcomeScreen;

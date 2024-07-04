// Dark Gradient Background Wrapper in SafeAreaView with centered properties

import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const BgDarkGradient = ({
  children,
  extraClasses,
  linearGradientMarginTop,
}) => {
  return (
    <SafeAreaView
      className={`${extraClasses} flex-1 relative items-center justify-center`}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(5,0,33,1)", "rgba(10,0,72,1)", "rgba(5,0,33,1)"]}
        locations={["0.5", "0.8", "1"]}
        className={`${linearGradientMarginTop}`}
      >
        <View
          className={`${extraClasses} relative items-center justify-center border-2 mt-4`}
        >
          {children}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default BgDarkGradient;

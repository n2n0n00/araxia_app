// Black Background Wrapper with centered properties for feed etc over the BgDarkGradient

import { StyleSheet, SafeAreaView, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const BgBlackOverlay = ({ children, extraClasses, innerClasses }) => {
  return (
    <View
      className={`${extraClasses} flex-1 relative items-center justify-center`}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(9,1,64,0)", "rgba(6,1,41,0.7)", "rgba(5,1,36,1)"]}
        locations={["0", "0.4", "1"]}
        className={`${innerClasses}`}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

export default BgBlackOverlay;

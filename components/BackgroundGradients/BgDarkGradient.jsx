// Dark Gradient Background Wrapper in SafeAreaView with centered properties

import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";

const BgDarkGradient = ({ children, extraClasses }) => {
  return (
    <SafeAreaView
      className={`${extraClasses} flex-1 relative items-center justify-center`}
      style={styles.background}
    >
      {children}
    </SafeAreaView>
  );
};

export default BgDarkGradient;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgb(5,0,33)",
    backgroundImage:
      "linear-gradient(90deg, rgba(5,0,33,1) 0%, rgba(10,0,72,1) 54%, rgba(5,0,33,1) 100%);",
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

const MenuGlassContainer = () => {
  return (
    <View style={styles.container}>
      <BlurView intensity={50} style={styles.blurView}>
        <View style={styles.overlay} />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#8F29FD",
    opacity: 0.3, // Adjust opacity to your preference
  },
});

export default MenuGlassContainer;

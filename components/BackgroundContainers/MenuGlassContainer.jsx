import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

const MenuGlassContainer = (props) => {
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70, // Adjust the height as needed
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#8F29FD",
    opacity: 0.3, // Adjust opacity to your preference
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabBar: {
    backgroundColor: "transparent",
    borderTopWidth: 0, // Remove the border
    elevation: 0, // Remove the shadow on Android
  },
});

export default MenuGlassContainer;

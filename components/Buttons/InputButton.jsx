import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const InputButton = ({ onPress, extraClasses, children }) => {
  return (
    <View className={`${extraClasses}`}>
      <LinearGradient
        colors={[
          "rgba(157,61,248,1)",
          "rgba(48,178,131,1)",
          "rgba(173,218,78,1)",
        ]}
        locations={[0, 0.53, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.05, y: 1 }}
        style={styles.button}
      >
        <View style={styles.inner}>
          <View className="bg-white">
            <TouchableOpacity onPress={onPress} style={styles.touchable}>
              {children}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default InputButton;

const styles = StyleSheet.create({
  touchable: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  gradientBorder: {
    padding: 4, // Adjust the padding to control the border thickness
    borderRadius: 30,
  },
  inner: {
    borderRadius: 30,
    overflow: "hidden", // Ensure the inner button stays within the border
  },
  button: {
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 30,
    alignItems: "center",
  },
});

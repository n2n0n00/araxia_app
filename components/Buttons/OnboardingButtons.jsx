import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const OnboardingButtons = ({
  onPress,
  extraClasses,
  children,
  textClasses,
}) => {
  return (
    <View className={`${extraClasses}`}>
      <LinearGradient
        colors={[
          "rgba(56,128,90,1)",
          "rgba(163,156,208,1)",
          "rgba(173,218,78,1)",
          "rgba(152,113,134,1)",
        ]}
        locations={[0, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.inner}>
          <View>
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
              <TouchableOpacity onPress={onPress} style={styles.touchable}>
                <Text className={`text-white ${textClasses}`}>{children}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default OnboardingButtons;

const styles = StyleSheet.create({
  touchable: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  gradientBorder: {
    padding: 4, // Adjust the padding to control the border thickness
    borderRadius: 50,
  },
  inner: {
    borderRadius: 50,
    overflow: "hidden", // Ensure the inner button stays within the border
  },
  button: {
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
});

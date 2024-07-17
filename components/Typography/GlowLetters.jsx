import { StyleSheet, View } from "react-native";
import React from "react";
import TextBold25 from "./TextBold25";

const GlowLetters = ({ children }) => {
  return (
    <View className="items-start">
      <View className="border-b-[2px] border-[#C796FF] items-start justify-center pb-3 mb-4">
        <TextBold25 extraClasses="text-[#C796FF]" styles={styles.glow}>
          {children}
        </TextBold25>
      </View>
    </View>
  );
};

export default GlowLetters;

const styles = StyleSheet.create({
  glow: {
    textShadowColor: "#C796FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});

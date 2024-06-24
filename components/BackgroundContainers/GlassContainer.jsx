import { View, Text, Image } from "react-native";
import React from "react";

const GlassContainer = ({ children, extraClasses }) => {
  return (
    <View className={`${extraClasses} items-center`}>
      <View className="backdrop-filter backdrop-blur-lg bg-white/10 border-2 border-white/50 rounded-3xl px-8 py-4 w-[95vw]">
        {children}
      </View>
    </View>
  );
};

export default GlassContainer;

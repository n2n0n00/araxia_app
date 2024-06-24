import React from "react";
import { View, Image } from "react-native";

const GradientImageText = ({ image, extraClasses }) => {
  return (
    <View className="relative">
      <Image
        source={image}
        resizeMethod="contain"
        className={`${extraClasses}`}
      />
    </View>
  );
};

export default GradientImageText;

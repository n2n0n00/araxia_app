import { Text } from "react-native";
import React from "react";

const TextSemi20 = ({ children, extraClasses, numLines }) => {
  return (
    <Text
      className={`text-white font-msemibold text-xl ${extraClasses}`}
      numberOfLines={numLines}
    >
      {children}
    </Text>
  );
};

export default TextSemi20;

import { Text } from "react-native";
import React from "react";

const TextBold20 = ({ children, extraClasses, numLines }) => {
  return (
    <Text
      className={`text-white font-mbold text-xl ${extraClasses}`}
      numberOfLines={numLines}
    >
      {children}
    </Text>
  );
};

export default TextBold20;

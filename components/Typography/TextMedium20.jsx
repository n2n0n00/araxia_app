import { Text } from "react-native";
import React from "react";

const TextMedium20 = ({ children, extraClasses, numLines }) => {
  return (
    <Text
      className={`text-white font-mmedium text-xl ${extraClasses}`}
      numberOfLines={numLines}
    >
      {children}
    </Text>
  );
};

export default TextMedium20;

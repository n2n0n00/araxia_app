import { Text } from "react-native";
import React from "react";

const TextRegular18 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-mregular text-lg ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextRegular18;

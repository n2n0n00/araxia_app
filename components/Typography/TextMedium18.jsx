import { Text } from "react-native";
import React from "react";

const TextMedium18 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-mmedium text-lg ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextMedium18;

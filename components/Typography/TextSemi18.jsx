import { Text } from "react-native";
import React from "react";

const TextSemi18 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-msemibold text-lg ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextSemi18;

import { Text } from "react-native";
import React from "react";

const TextSemi25 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-msemibold text-2xl ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextSemi25;

import { Text } from "react-native";
import React from "react";

const TextSemi27 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-msemibold text-3xl ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextSemi27;

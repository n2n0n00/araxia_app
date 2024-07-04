import { Text } from "react-native";
import React from "react";

const TextSemi20 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-msemibold text-xl ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextSemi20;

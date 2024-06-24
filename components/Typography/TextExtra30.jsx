import { Text } from "react-native";
import React from "react";

const TextExtra30 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-mextrabold text-3xl ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextExtra30;

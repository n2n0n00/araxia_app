import { Text } from "react-native";
import React from "react";

const TextExtra14 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-mextrabold text-[14px] ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextExtra14;

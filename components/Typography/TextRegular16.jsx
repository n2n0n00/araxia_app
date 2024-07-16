import { Text } from "react-native";
import React from "react";

const TextRegular16 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-mregular text-base ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextRegular16;

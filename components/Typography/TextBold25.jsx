import { Text } from "react-native";
import React from "react";

const TextBold25 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-mbold text-2xl ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextBold25;

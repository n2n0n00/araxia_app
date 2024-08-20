import { Text } from "react-native";
import React from "react";

const TextRegular13 = ({ children, extraClasses }) => {
  return (
    <Text className={`text-white font-mregular text-[13px] ${extraClasses}`}>
      {children}
    </Text>
  );
};

export default TextRegular13;

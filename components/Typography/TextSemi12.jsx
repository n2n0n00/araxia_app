import { Text } from "react-native";
import React from "react";

const TextSemi12 = ({ children, extraClasses, numberOfLines }) => {
  return (
    <Text
      className={`text-white font-msemibold text-[12px] text-ellipsis ${extraClasses}`}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default TextSemi12;

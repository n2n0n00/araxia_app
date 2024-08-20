import { Text } from "react-native";
import React from "react";

const TextSemi14 = ({ children, extraClasses, numberOfLines }) => {
  return (
    <Text
      className={`text-white font-msemibold text-sm text-ellipsis ${extraClasses}`}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default TextSemi14;

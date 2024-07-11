import { Text } from "react-native";
import React from "react";

const TextBold15 = ({ children, extraClasses, numberOfLines }) => {
  return (
    <Text
      className={`text-white font-mbold text-sm text-ellipsis ${extraClasses}`}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default TextBold15;

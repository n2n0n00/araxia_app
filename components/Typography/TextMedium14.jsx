import { Text } from "react-native";
import React from "react";

const TextMedium14 = ({ children, extraClasses, numberOfLines }) => {
  return (
    <Text
      className={`text-white font-mmedium text-sm text-ellipsis ${extraClasses}`}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default TextMedium14;

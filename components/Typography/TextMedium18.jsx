import { Text } from "react-native";
import React from "react";

const TextMedium18 = ({ children, extraClasses, numberOfLines }) => {
  return (
    <Text
      className={`text-white font-mmedium text-lg text-ellipsis ${extraClasses}`}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default TextMedium18;

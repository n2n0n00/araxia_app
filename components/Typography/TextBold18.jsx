import { Text } from "react-native";
import React from "react";

const TextBold18 = ({ children, extraClasses, styles }) => {
  return (
    <Text
      className={`text-white font-mbold text-lg ${extraClasses}`}
      style={styles}
    >
      {children}
    </Text>
  );
};

export default TextBold18;

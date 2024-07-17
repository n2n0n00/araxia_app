import { Text } from "react-native";
import React from "react";

const TextExtra22 = ({ children, extraClasses, styles }) => {
  return (
    <Text
      className={`text-white font-mextrabold text-[22px] ${extraClasses}`}
      style={styles}
    >
      {children}
    </Text>
  );
};

export default TextExtra22;

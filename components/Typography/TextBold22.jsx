import { Text } from "react-native";
import React from "react";

const TextBold22 = ({ children, extraClasses, styles }) => {
  return (
    <Text
      className={`text-white font-mbold text-[22px] ${extraClasses}`}
      style={styles}
    >
      {children}
    </Text>
  );
};

export default TextBold22;

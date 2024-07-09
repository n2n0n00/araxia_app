import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import TextSemi18 from "../Typography/TextSemi18";

const SubmitButton = ({ label, onPress, extraClasses }) => {
  return (
    <TouchableOpacity onPress={onPress} className={`${extraClasses}`}>
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={["rgba(173,218,78,1)", "rgba(48,178,131,1)"]}
        locations={["0", "1"]}
        className="w-full h-full p-3 rounded-3xl items-center justify-center"
      >
        <TextSemi18>{label}</TextSemi18>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default SubmitButton;

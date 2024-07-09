import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { router, usePathname } from "expo-router";
import TextSemi18 from "../../components/Typography/TextSemi18";

const EditFields = ({
  label,
  icon,
  value,
  iconsLibrary,
  onChangeText,
  extraClasses,
  ...props
}) => {
  // const [valueEdit, setValueEdit] = useState(value || "");
  return (
    <View className={`flex-col items-start ${extraClasses}`}>
      <TextSemi18 extraClasses={"pb-2 pl-2"}>{label}</TextSemi18>
      <GlassContainer
        insideContainerClasses={
          "flex-row items-center justify-between py-3 px-4"
        }
      >
        <TouchableOpacity className="pr-2">
          {iconsLibrary === "Entypo" ? (
            <Entypo name={icon} size={24} color="white" />
          ) : (
            <FontAwesome name={icon} size={24} color="white" />
          )}
        </TouchableOpacity>

        <TextInput
          className="flex-1 text-white font-mregular mt-0.5 text-base"
          editable
          value={value}
          placeholder={value}
          placeholderTextColor="#cdcde0"
          onChangeText={onChangeText}
        />
      </GlassContainer>
    </View>
  );
};

export default EditFields;

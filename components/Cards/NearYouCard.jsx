import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextMedium18 from "../Typography/TextMedium18";
import { router } from "expo-router";

const NearYouCard = ({ expName, expArtist, expImage }) => {
  const expRoute = () => {
    //TODO add experiences routes
    router.push(`/upcoming_experiences/${expArtist}/${expName}`);
  };
  return (
    <TouchableOpacity onPress={expRoute} className="h-[180px]">
      <View className="mt-5 mr-4 relative w-[220px] h-[180px] rounded-3xl">
        <Image source={expImage} className="w-[220px] h-[180px] rounded-3xl" />
        <View className="absolute bottom-0 bg-black opacity-30 w-[220px] h-[60px] rounded-b-3xl" />
        <TextMedium18 extraClasses={"absolute bottom-5 left-2"}>
          {expName}
        </TextMedium18>
      </View>
    </TouchableOpacity>
  );
};

export default NearYouCard;

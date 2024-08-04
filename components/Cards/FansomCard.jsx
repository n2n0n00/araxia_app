import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextMedium18 from "../Typography/TextMedium18";
import { router } from "expo-router";

const FandomCard = ({ fandomName, fandomArtistId, fandomImage, fandomId }) => {
  const handleRoute = () => {
    router.push(`/fandom/${fandomArtistId}/${fandomId}`);
  };
  return (
    <TouchableOpacity onPress={handleRoute} className="h-[180px]">
      <View className="mt-5 mr-4 relative w-[220px] h-[180px] rounded-3xl">
        <Image
          source={fandomImage}
          className="w-[220px] h-[180px] rounded-3xl"
        />
        <View className="absolute bottom-0 bg-black opacity-30 w-[220px] h-[60px] rounded-b-3xl" />
        <TextMedium18 extraClasses={"absolute bottom-5 left-2"}>
          {fandomName}
        </TextMedium18>
      </View>
    </TouchableOpacity>
  );
};

export default FandomCard;

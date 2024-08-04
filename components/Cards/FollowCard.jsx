import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextMedium18 from "../Typography/TextMedium18";
import { router } from "expo-router";

const FollowCard = ({ userName, userId, userAvatar }) => {
  const handleRoute = () => {
    router.push(`/user/${userId}`);
  };
  return (
    <TouchableOpacity onPress={handleRoute} className="h-[180px]">
      <View className="mt-5 mr-4 relative w-[130px] h-[150px] rounded-3xl">
        <Image
          source={{ uri: userAvatar }}
          resizeMode="cover"
          className="w-[130px] h-[150px] rounded-3xl"
        />
        <View className="absolute bottom-0 bg-black opacity-30 w-[130px] h-[60px] rounded-b-3xl" />
        <TextMedium18 extraClasses={"absolute bottom-5 left-2"}>
          {userName}
        </TextMedium18>
      </View>
    </TouchableOpacity>
  );
};

export default FollowCard;

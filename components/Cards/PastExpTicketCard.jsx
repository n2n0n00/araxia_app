import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextMedium18 from "../Typography/TextMedium18";
import { router } from "expo-router";

const PastExpTicketCard = ({
  experienceName,
  experienceId,
  banner,
  userId,
  ticketId,
  artistId,
}) => {
  const pastTicketRoute = () => {
    //TODO add experiences routes
    router.push(`/tickets/${userId}/${experienceId}/${artistId}/${ticketId}`);
  };
  return (
    <TouchableOpacity onPress={pastTicketRoute} className="h-[200px]">
      <View className="mt-5 mr-4 relative w-[150px] h-[200px] rounded-3xl">
        <Image
          source={{ uri: banner }}
          resizeMode="cover"
          className="w-[150px] h-[200px] rounded-3xl"
        />
        <View className="absolute bottom-0 bg-black opacity-30 w-[150px] h-[60px] rounded-b-3xl" />
        <TextMedium18
          extraClasses={"absolute bottom-5 left-2 w-[150px]"}
          numberOfLines={1}
        >
          {experienceName}
        </TextMedium18>
      </View>
    </TouchableOpacity>
  );
};

export default PastExpTicketCard;

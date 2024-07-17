import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "../../constants";
import { router } from "expo-router";

const PastLocationExpCard = ({ expLocation, userId }) => {
  const handleLocationRoute = () => {
    router.push(`/past_locations/${userId}/${expLocation}`);
  };
  return (
    <TouchableOpacity
      className="items-center justify-center relative h-[120px] mb-4"
      onPress={handleLocationRoute}
    >
      <Image source={images.pastLocationBG} />
      <Text className="absolute w-[80px] text-[16px] font-msemibold text-white pb-2 text-center">
        {expLocation}
      </Text>
    </TouchableOpacity>
  );
};

export default PastLocationExpCard;

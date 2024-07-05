import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "../../constants";

const PastLocationExpCard = ({ expLocation, locationRoute }) => {
  return (
    <TouchableOpacity className="items-center justify-center relative h-[120px] mb-4">
      <Image source={images.pastLocationBG} />
      <Text className="absolute w-[80px] text-[16px] font-msemibold text-white pb-2 text-center">
        {expLocation}
      </Text>
    </TouchableOpacity>
  );
};

export default PastLocationExpCard;

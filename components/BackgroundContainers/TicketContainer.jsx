import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../../constants";

const TicketContainer = ({ children, extraClasses }) => {
  return (
    <View className="relative items-center">
      <View className="absolute items-center justify-center w-full h-full">
        <Image
          source={images.ticketBg}
          resizeMethod="contain"
          className="w-[370px]"
        />
      </View>

      <View className={`${extraClasses}`}>{children}</View>
    </View>
  );
};

export default TicketContainer;

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import TextSemi18 from "../Typography/TextSemi18";
import { LinearGradient } from "expo-linear-gradient";

const BuyNFTButton = ({ onPress, price }) => {
  return (
    <View className="relative w-[280px] bg-[#30B283] h-[50px] rounded-full mt-8">
      <View className="absolute right-[4px] top-[5px]">
        <TouchableOpacity className="w-full flex-row items-center justify-between">
          <TextSemi18 extraClasses={"pl-10"}>{price}</TextSemi18>
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={["rgba(173,218,78,1)", "rgba(48,178,131,1)"]}
            locations={["0", "1"]}
            className="w-[100px] h-[40px] rounded-3xl items-center justify-center"
          >
            <TextSemi18>BUY</TextSemi18>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BuyNFTButton;

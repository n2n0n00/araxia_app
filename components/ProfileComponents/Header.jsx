import { View, Text, Image } from "react-native";
import React from "react";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import { icons, images } from "../../constants";
import TextBold18 from "../Typography/TextBold18";
import TextMedium14 from "../Typography/TextMedium14";
import TextSemi27 from "../Typography/TextSemi27";

const Header = () => {
  return (
    <GlassContainer
      insideContainerClasses={"flex-col items-center justify-center px-3 py-12"}
    >
      <View className="flex-row items-center justify-between w-full">
        <View>
          <View className="flex-row items-start justify-start mb-8">
            <Image source={icons.nftCount} />
            <View className="flex-col pl-2">
              <TextBold18>100</TextBold18>
              <TextMedium14>NFTs</TextMedium14>
            </View>
          </View>
          <View className="flex-row items-start justify-start">
            <Image source={icons.levelXP} />
            <View className="flex-col pl-2">
              <TextBold18>10</TextBold18>
              <TextMedium14>XP</TextMedium14>
            </View>
          </View>
        </View>
        <View>
          <Image source={images.dummyAvatar} />
        </View>
        <View className="flex-col">
          <View className="mb-8">
            <TextBold18>100</TextBold18>
            <TextMedium14>Following</TextMedium14>
          </View>
          <View>
            <TextBold18>100</TextBold18>
            <TextMedium14>Followers</TextMedium14>
          </View>
        </View>
      </View>
      <View className="flex-col items-center mt-4">
        <TextMedium14 extraClasses={"text-[#9D9C9C] mb-1"}>
          0x00...000
        </TextMedium14>
        <TextSemi27 extraClasses={"mb-1"}>User Name</TextSemi27>
        <TextMedium14 extraClasses={"text-[#9D9C9C] text-center"}>
          0Art is fun. I love BTS Art is fun. I love BTS
        </TextMedium14>
      </View>
    </GlassContainer>
  );
};

export default Header;

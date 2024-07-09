import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import { icons, images } from "../../constants";
import TextBold18 from "../Typography/TextBold18";
import TextMedium14 from "../Typography/TextMedium14";
import TextSemi27 from "../Typography/TextSemi27";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

const Header = ({
  avatar,
  totalNfts,
  levelXP,
  followers,
  following,
  cryptoAddress,
  username,
  bio,
  userId,
}) => {
  const handleEdit = () => {
    router.push(`/edit/${userId}/UserProfile`);
  };
  return (
    <GlassContainer
      insideContainerClasses={"flex-col items-center justify-center px-3 pb-12"}
    >
      <TouchableOpacity onPress={handleEdit}>
        <View className="flex-row gap-2 w-full items-center justify-end pb-4 pt-4 pr-4">
          <AntDesign name="edit" size={24} color="white" />
        </View>
      </TouchableOpacity>
      <View className="flex-row items-center justify-between w-full">
        <View>
          <View className="flex-row items-start justify-start mb-8">
            <Image source={icons.nftCount} />
            <View className="flex-col pl-2">
              <TextBold18>{totalNfts}</TextBold18>
              <TextMedium14>NFTs</TextMedium14>
            </View>
          </View>
          <View className="flex-row items-start justify-start">
            <Image source={icons.levelXP} />
            <View className="flex-col pl-2">
              <TextBold18>{levelXP}</TextBold18>
              <TextMedium14>XP</TextMedium14>
            </View>
          </View>
        </View>
        <View className="relative items-center justify-center">
          <Image
            source={images.profileBG}
            resizeMethod="contain"
            className="w-[150px] h-[150px] rounded-full items-center justify-center"
          />
          <Image
            source={{ uri: avatar }}
            resizeMethod="contain"
            className="w-[110px] h-[110px] rounded-full items-center justify-center absolute left-[22px]"
          />
        </View>
        <View className="flex-col">
          <View className="mb-8">
            <TextBold18>{following}</TextBold18>
            <TextMedium14>Following</TextMedium14>
          </View>
          <View>
            <TextBold18>{followers}</TextBold18>
            <TextMedium14>Followers</TextMedium14>
          </View>
        </View>
      </View>
      <View className="flex-col items-center mt-4">
        <TextMedium14 extraClasses={"text-[#9D9C9C] mb-1"}>
          {cryptoAddress}
        </TextMedium14>
        <TextSemi27 extraClasses={"mb-1"}>{username}</TextSemi27>
        <TextMedium14 extraClasses={"text-[#9D9C9C] text-center"}>
          {bio}
        </TextMedium14>
      </View>
    </GlassContainer>
  );
};

export default Header;

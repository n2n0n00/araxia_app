import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextMedium18 from "../Typography/TextMedium18";
import { router } from "expo-router";

//userOrigin is who made the experience etc, componentId is id of each category item each time

const SearchCard = ({ image, name, filter, componentId, userOriginId }) => {
  const navigateToRoute = () => {
    switch (filter) {
      case "Artist":
        router.push(`/artist/${componentId}`);
        break;
      case "User":
        router.push(`/user/${componentId}`);
        break;
      case "Experience":
        // console.log(userOriginId, componentId);
        router.push(`/experience/${userOriginId}/${componentId}`);
        break;
      case "NFT":
        router.push(`/global_nfts/${userOriginId}/${componentId}`);
        break;
    }
  };

  return (
    <TouchableOpacity onPress={navigateToRoute} className="h-[200px]">
      <View className="mt-5 mr-4 relative w-[150px] h-[200px] rounded-3xl">
        <Image
          source={{ uri: image }}
          resizeMethod="contain"
          className="w-[150px] h-[200px] rounded-3xl"
        />
        <View className="absolute bottom-0 bg-black opacity-30 w-[150px] h-[60px] rounded-b-3xl" />
        <TextMedium18
          numberOfLines={1}
          extraClasses="absolute bottom-5 left-2 w-[120px]"
        >
          {name}
        </TextMedium18>
      </View>
    </TouchableOpacity>
  );
};

export default SearchCard;

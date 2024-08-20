import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextSemi12 from "../../components/Typography/TextSemi12";
import { router } from "expo-router";

const ReplierProfile = ({ userId, username, userAvatar }) => {
  const handleReplier = () => {
    router.push(`/user/${userId}`);
  };
  return (
    <TouchableOpacity
      onPress={handleReplier}
      className="flex-row items-center mb-4"
    >
      <Image
        source={{ uri: userAvatar }}
        resizeMode="cover"
        className="w-[30px] h-[30px] rounded-full mr-1"
      />
      <TextSemi12>{username}</TextSemi12>
    </TouchableOpacity>
  );
};

export default ReplierProfile;

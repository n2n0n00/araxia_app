import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import TextSemi14 from "../../components/Typography/TextSemi14";
import { router } from "expo-router";

const CommentProfile = ({ userId, username, userAvatar }) => {
  const handleCommenter = () => {
    router.push(`/user/${userId}`);
  };
  return (
    <TouchableOpacity
      onPress={handleCommenter}
      className="flex-row items-center"
    >
      <Image
        source={{ uri: userAvatar }}
        resizeMode="cover"
        className="w-[40px] h-[40px] rounded-full mr-2"
      />
      <TextSemi14>{username}</TextSemi14>
    </TouchableOpacity>
  );
};

export default CommentProfile;

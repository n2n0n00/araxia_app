import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { icons } from "../../constants";

const AraxiaHeadBar = ({ nonTabPage }) => {
  const handleBack = () => {
    router.back();
  };
  const goToFeed = () => {
    router.push("./feed");
  };

  const goToMessages = () => {
    router.push("/messages/[messages]");
  };

  const goToNotifications = () => {
    router.push("/notifications/[notifications]");
  };

  return (
    <View className="flex-row items-center justify-between w-screen p-4 pt-16">
      {nonTabPage ? (
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBack}>
            <Image source={icons.backArrow} resizeMethod="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToFeed}>
            <Text className="font-osemibold text-4xl text-[#8F29FD] pl-5">
              araxia
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={goToFeed}>
          <Text className="font-osemibold text-4xl text-[#8F29FD]">araxia</Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center justify-center">
        <TouchableOpacity onPress={goToNotifications} className="pr-8">
          <Image source={icons.userNotifications} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToMessages}>
          <Image source={icons.userMessages} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AraxiaHeadBar;

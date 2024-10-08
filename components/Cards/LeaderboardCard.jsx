import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { icons, images } from "../../constants";
import { router } from "expo-router";
import { fetchUserDetails } from "../../api/supabase_api";

const LeaderboardCard = ({
  rank,
  friendsAdded,
  username,
  userAddress,
  userId,
  userAvatar,
  XPsCaptured,
  totalAvailableXPs,
  highRank,
}) => {
  const [userData, setUserData] = useState();
  const leaderboardCardRoute = () => {
    router.push(`/user/${userId}`);
  };

  const getUserIdData = async () => {
    const userRankedData = await fetchUserDetails(userId);
    setUserData(userRankedData[0]);
  };

  useEffect(() => {
    getUserIdData();
  }, [userId]);

  const higherRankPlayer = () => (
    <TouchableOpacity onPress={leaderboardCardRoute} className="h-[215px]">
      <View className="bg-purple-900 h-[205px] w-[139px] rounded-2xl relative">
        <View className="absolute -top-8 right-11">
          <Image source={icons.star} className="h-[45px] w-[48px]" />
          <View className="relative items-center justify-center ">
            <Text className="absolute -top-9 font-msemibold text-[20px] text-white">
              {rank}
            </Text>
          </View>
        </View>

        <View className="flex-col items-center justify-center pt-8">
          <Image
            source={{ uri: userData?.avatar }}
            resizeMethod="contain"
            className="h-[80px] w-[80px] rounded-full"
          />
          <Text className="font-mbold text-[15px] text-white pt-2">
            {userData?.username}
          </Text>
          <View className="flex-col items-start justify-start pt-2 w-full pl-3">
            <Text className="text-[14px] font-msemibold text-white">
              Friends: {friendsAdded}
            </Text>
            <Text className="text-[14px] font-msemibold text-white">
              XPs: {XPsCaptured} XP
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const restOfPlayers = () => (
    <TouchableOpacity
      onPress={leaderboardCardRoute}
      className="h-[100px] w-screen"
    >
      <View className="bg-purple-700 h-[100px] w-screen rounded-2xl relative flex-row items-center justify-start">
        <View className="absolute top-6 left-2">
          <Image source={icons.star} className="h-[45px] w-[48px]" />
          <View className="relative items-center justify-center ">
            <Text className="absolute -top-9 font-msemibold text-[20px] text-white">
              {rank}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between pl-[70px] w-full">
          <View className="flex-row items-center justify-start">
            <Image
              source={{ uri: userData?.avatar }}
              resizeMethod="contain"
              className="h-[60px] w-[60px] rounded-full"
            />
            <View className="flex-col items-start justify-start pt-2 pl-4">
              <Text className="font-mbold text-[15px] text-white">
                {userData?.username}
              </Text>
              {/* <Text className="font-msemibold text-[10px] text-[#9D9C9C] pt-2">
                {userAddress}
              </Text> */}
            </View>
          </View>

          <View className="flex-col items-end justify-end pt-2 pl-3 pr-6">
            <Text className="text-[14px] font-mbold text-white">
              Friends: {friendsAdded}
            </Text>
            <Text className="text-[14px] font-mbold text-white">
              XPs: {XPsCaptured} XP
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return highRank ? higherRankPlayer() : restOfPlayers();
};

export default LeaderboardCard;

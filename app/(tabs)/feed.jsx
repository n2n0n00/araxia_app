import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";

import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";

import { useAuth } from "../../context/AuthProvider";
import SearchBar from "../../components/Search/SearchBar";
import LeaderboardCard from "../../components/Cards/LeaderboardCard";

const Feed = () => {
  const { authUser } = useAuth();

  //TODO: ADD A LOADER TO WAIT UNTIL ARTISTS ARE FETCHED!!!!

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <BgBlackOverlay>
          <AraxiaHeadBar />
          <View className="pt-4">
            <SearchBar
              placeholder={"Search for an experience..."}
              initialQuery={null}
              leaderboardSearch
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={null}
            keyExtractor={(item) => item.experience_id}
            renderItem={null}
            ListHeaderComponentStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            ListHeaderComponent={
              <View className="pt-8 pb-16">
                <Text className="font-mbold text-white text-[22px] text-center">
                  John Smith’s: Winter Wonderland Quest
                </Text>
              </View>
            }
            ListFooterComponent={
              <View className="items-center justify-center">
                <View className=" flex-row">
                  <View className="pr-2 pt-6">
                    <LeaderboardCard rank={2} highRank />
                  </View>
                  <View className="pr-2">
                    <LeaderboardCard rank={1} highRank />
                  </View>
                  <View className="pt-10">
                    <LeaderboardCard rank={3} highRank />
                  </View>
                </View>
                <View className="flex-col items-center justify-center">
                  <View className="pt-10">
                    <LeaderboardCard
                      rank={3}
                      userAddress={"randomshit"}
                      username={"randomshit"}
                    />
                  </View>
                  <View className="pt-2">
                    <LeaderboardCard
                      rank={4}
                      userAddress={"randomshit"}
                      username={"randomshit"}
                    />
                  </View>
                </View>
              </View>
            }
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Feed;

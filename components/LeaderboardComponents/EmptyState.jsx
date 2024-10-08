import { View, Text } from "react-native";
import React from "react";

const EmptyState = (results) => {
  if (Object.keys(results).length === 0) {
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
                setFilter={handleOpenFilterModal}
                leaderboardSearch
              />
            </View>
            <View className="h-[85vh]">
              <Text>No results found.</Text>
            </View>
          </BgBlackOverlay>
        </BgDarkGradient>
      </SafeAreaView>
    );
  }
};

export default EmptyState;

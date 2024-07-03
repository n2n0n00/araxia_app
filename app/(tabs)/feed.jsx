import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import TextSemi25 from "../../components/Typography/TextSemi25";
import UpcomingExpCard from "../../components/Cards/UpcomingExpCard";
import { exp } from "../../constants/constants";
import TopNFTsTopArtists from "../../components/TopNFTsTopArtists/TopNFTsTopArtists";

const Feed = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(false);
    // recall exp to see if any new ones
    //  await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView>
      <BgDarkGradient>
        <View className="items-center justify-center w-screen relative pt-8">
          <Image
            source={images.loginBG}
            resizeMode="contain"
            className="w-screen h-full top-0 mt-6 rounded-3xl absolute -z-50"
          />
          <AraxiaHeadBar />
          <View className="flex-col items-start w-screen h-screen p-4">
            <View className="h-[330px]">
              <TextSemi25>Your Upcoming Experiences...</TextSemi25>
              <FlatList
                horizontal
                className="overflow-x-scroll"
                data={exp}
                keyExtractor={(item) => item.expName}
                renderItem={({ item }) => (
                  <UpcomingExpCard
                    expName={item.expName}
                    expArtist={item.expArtist}
                    expLink={item.expLink}
                    expImage={item.expImage}
                  />
                )}
                ListEmptyComponent={() => (
                  <EmptyState
                    title="No Experiences Found"
                    subtitle="Get Your First Experience At The Marketplace"
                  />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>

            <View className="items-center justify-center flex-1 w-full h-full">
              <TopNFTsTopArtists />
            </View>
          </View>
        </View>
      </BgDarkGradient>
    </ScrollView>
  );
};

export default Feed;

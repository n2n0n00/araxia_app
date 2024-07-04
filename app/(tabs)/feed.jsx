import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import UpcomingExpCard from "../../components/Cards/UpcomingExpCard";
import { exp } from "../../constants/constants";
import TextSemi20 from "../../components/Typography/TextSemi20";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import TabsInterface from "../../components/TabsInterface/TabsInterface";
import TopNFTs from "../../components/FeedComponents/TopNFTs";
import TopArtists from "../../components/FeedComponents/TopArtists";

const Feed = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Add your refetch logic here
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <BgBlackOverlay>
          <FlatList
            ListHeaderComponent={
              <>
                <AraxiaHeadBar />
                <View className="flex-col items-start w-screen p-4 h-[300px]">
                  <TextSemi20>Your Upcoming Experiences...</TextSemi20>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
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
              </>
            }
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={null}
            ListFooterComponent={
              <View className="items-center justify-center flex-1 w-full p-4 h-full">
                <TabsInterface
                  tabLeft={"TopNFTs"}
                  tabRight={"TopArtists"}
                  tabLeftComponent={<TopNFTs />}
                  tabRightComponent={<TopArtists />}
                  tabLeftLabel={"Top NFTs"}
                  tabRightLabel={"Top Artists"}
                />
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Feed;

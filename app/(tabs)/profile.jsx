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
import GlassContainer from "../../components/BackgroundContainers/GlassContainer";
import Header from "../../components/ProfileComponents/Header";
import NFTsList from "../../components/ProfileComponents/NFTsList";
import ExperiencesPosts from "../../components/ProfileComponents/ExperiencesPosts";

const Profile = () => {
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
                <View className="flex-col items-center w-full p-4 h-[378.82px]">
                  <Header />
                </View>
              </>
            }
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={null}
            ListFooterComponent={
              <View className="items-center justify-center flex-1 w-full p-4 mt-10 h-full">
                <TabsInterface
                  tabLeft={"nfts"}
                  tabRight={"experiences"}
                  tabLeftComponent={<NFTsList />}
                  tabRightComponent={<ExperiencesPosts />}
                  tabLeftLabel={"NFTs"}
                  tabRightLabel={"Experiences"}
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

export default Profile;

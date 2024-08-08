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
import UpcomingExpCard from "../../components/Cards/UpcomingExpCard";
import TextSemi20 from "../../components/Typography/TextSemi20";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import TabsInterface from "../../components/TabsInterface/TabsInterface";
import TopNFTs from "../../components/FeedComponents/TopNFTs";
import TopArtists from "../../components/FeedComponents/TopArtists";
import { useAuth } from "../../context/AuthProvider";
import { fetchLikedArtistsData } from "../../api/supabase_api";

const Feed = () => {
  const { authUser } = useAuth();
  const [userLikedArtists, setUserLikedArtists] = useState([]);
  const [topNFTs, setTopNFTs] = useState([]);

  const likedArtists = async () => {
    try {
      // const artists = await fetchLikedArtistsData(authUser.userId);
      // setUserLikedArtists(artists);
    } catch (error) {
      // console.error("Error fetching liked artists:", error);
    }
  };

  // const currentTopNFTs = async () => {
  //   try {
  //     const NFTs = await fetchTopNFTs()
  //   } catch (error) {

  //   }
  // }

  //TODO: ADD A LOADER TO WAIT UNTIL ARTISTS ARE FETCHED!!!!

  useEffect(() => {
    if (authUser && authUser.userId) {
      likedArtists();
    }
  }, [authUser]);

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
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={likedArtists}
            //   />
            // }
            ListHeaderComponent={
              <>
                <AraxiaHeadBar />
                <View className="flex-col items-start w-screen p-4 h-[300px]">
                  <TextSemi20>Your Favorite Artists</TextSemi20>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={userLikedArtists}
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item }) => (
                      <UpcomingExpCard
                        artistName={item.username}
                        artistId={item.userId}
                        artistAvatar={item.avatar}
                      />
                    )}
                    ListEmptyComponent={() => (
                      <View className="flex items-center justify-center">
                        <Text>No Favorite Artists Found</Text>
                      </View>
                    )}
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
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Feed;

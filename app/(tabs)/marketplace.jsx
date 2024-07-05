import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import NearYouCard from "../../components/Cards/NearYouCard";
import {
  marketplaceTopArtists,
  marketplaceTopNear,
} from "../../constants/constants";
import TextSemi20 from "../../components/Typography/TextSemi20";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import TabsInterface from "../../components/TabsInterface/TabsInterface";
import TopNFTs from "../../components/FeedComponents/TopNFTs";
import TopArtists from "../../components/FeedComponents/TopArtists";
import { useLocalSearchParams } from "expo-router";
import TextBold25 from "../../components/Typography/TextBold25";
import SearchBar from "../../components/Search/SearchBar";
import TopArtistsMarketplaceCard from "../../components/Cards/TopArtistsMarketplaceCard";

const Marketplace = () => {
  const { query } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  //searchbar query searches the database
  // const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
  // then pushes the data into the searchQuery as a data?

  const onRefresh = async () => {
    setRefreshing(true);
    // Add your refetch logic  here
    setRefreshing(false);
  };

  const refetch = () => <></>;
  useEffect(() => {
    refetch();
  }, [query]);

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
                <View>
                  <SearchBar
                    placeholder={"Search for an experience..."}
                    initialQuery={query}
                  />
                </View>
                <View className="flex-col items-start w-screen p-4 h-[300px]">
                  <View className="border-b-[2px] border-[#C796FF] w-[195px] items-center justify-center pb-3">
                    <TextBold25
                      extraClasses="text-[#C796FF]"
                      styles={styles.glow}
                    >
                      Near You
                    </TextBold25>
                  </View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={marketplaceTopNear}
                    keyExtractor={(item) => item.expName}
                    renderItem={({ item }) => (
                      <NearYouCard
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
            ListFooterComponentStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            ListFooterComponent={
              <>
                <View className="flex-col items-center w-screen p-4 h-full mb-8">
                  <View className="w-screen p-4 items-start">
                    <View className="border-b-[2px] border-[#C796FF] w-[195px] items-center justify-center pb-3">
                      <TextBold25
                        extraClasses="text-[#C796FF]"
                        styles={styles.glow}
                      >
                        Top Artists
                      </TextBold25>
                    </View>
                  </View>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={marketplaceTopArtists}
                    keyExtractor={(item) => item.expName}
                    renderItem={({ item }) => (
                      <TopArtistsMarketplaceCard
                        banner={item.expImage}
                        content={item.content}
                        artistName={item.expArtist}
                        cryptoAddress={item.cryptoAddress}
                        avatar={item.avatar}
                        price={item.price}
                        getExpLink={item.expLink}
                        expLocation={item.location}
                        date={item.date}
                        expName={item.expName}
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Marketplace;

const styles = StyleSheet.create({
  glow: {
    textShadowColor: "#C796FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});

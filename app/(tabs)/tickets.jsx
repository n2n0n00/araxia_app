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
  locations,
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
import PastLocationExpCard from "../../components/Cards/PastLocationExpCard";
import MyTicketUpcomingCard from "../../components/Cards/MyTicketUpcomingCard";

const Tickets = () => {
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
                <View className="flex-col items-start w-screen p-4 h-[250px]">
                  <View className="border-b-[2px] border-[#C796FF] w-[195px] items-center justify-center pb-3">
                    <TextBold25
                      extraClasses="text-[#C796FF]"
                      styles={styles.glow}
                    >
                      Upcoming
                    </TextBold25>
                  </View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={marketplaceTopArtists}
                    keyExtractor={(item) => item.expArtist}
                    renderItem={({ item }) => (
                      <MyTicketUpcomingCard
                        expName={item.expName}
                        expArtist={item.expArtist}
                        ticketLink={item.expLink}
                        expDate={item.date}
                        expLocation={item.location}
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
                    <View className="border-b-[2px] border-[#C796FF] w-[250px] items-center justify-center pb-3 mb-4">
                      <TextBold25
                        extraClasses="text-[#C796FF]"
                        styles={styles.glow}
                      >
                        Past Experiences
                      </TextBold25>
                    </View>
                  </View>
                  <FlatList
                    horizontal={false}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    data={locations}
                    contentContainerStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    keyExtractor={(item) => item.location}
                    renderItem={({ item }) => (
                      <PastLocationExpCard
                        expLocation={item.location}
                        // locationRoute={locationRoute}
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

export default Tickets;

const styles = StyleSheet.create({
  glow: {
    textShadowColor: "#C796FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});

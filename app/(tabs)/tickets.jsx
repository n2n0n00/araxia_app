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
import MyTicketUpcomingCard from "../../components/Cards/MyTicketUpcomingCard";
import TextBold25 from "../../components/Typography/TextBold25";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import SearchBar from "../../components/Search/SearchBar";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthProvider";
import {
  fetchPastCities,
  fetchUserUpcomingEvents,
} from "../../api/supabase_api";
import { locations } from "../../constants/constants";
import PastLocationExpCard from "../../components/Cards/PastLocationExpCard";

const Tickets = () => {
  const { authUser } = useAuth();
  const [upcomingExp, setUpcomingExp] = useState([]);
  const [pastExp, setPastExp] = useState([]);
  const { query } = useLocalSearchParams();

  const getUpcomingTickets = async () => {
    try {
      const upcomingTickets = await fetchUserUpcomingEvents(authUser.userId);
      setUpcomingExp(upcomingTickets);
    } catch (error) {
      console.error(error);
    }
  };

  const getPastExperiencesCities = async () => {
    try {
      const pastCities = await fetchPastCities(authUser.userId);
      setPastExp(pastCities);
      console.log(pastCities);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUpcomingTickets();
    getPastExperiencesCities();
  }, [authUser.userId]);

  useEffect(() => {
    // Call a function or perform any action when query changes
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
                    data={upcomingExp}
                    keyExtractor={(item) => item.ticket_id}
                    renderItem={({ item }) => {
                      const handleTicket = () => {
                        router.push(
                          `/tickets/${authUser.userId}/${item.artist_id}/${item.ticket_id}`
                        );
                      };
                      return (
                        <MyTicketUpcomingCard
                          expName={item.experience_name}
                          expArtist={item.artist_name}
                          ticketLink={handleTicket}
                          expDate={item.experience_starts_at}
                          expLocation={`${item.tour_location}, ${item.experience_country}`}
                        />
                      );
                    }}
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
                    contentContainerStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    data={Object.keys(pastExp)}
                    keyExtractor={(location) => location}
                    renderItem={({ item: location }) => (
                      <PastLocationExpCard
                        expLocation={location}
                        userId={authUser.userId}
                      />
                    )}
                  />
                </View>
              </>
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { useAuth } from "../../../context/AuthProvider";
import { fetchPastCitiesTickets } from "../../../api/supabase_api";
import { useLocalSearchParams } from "expo-router";
import AraxiaHeadBar from "../../../components/HeadBars/AraxiaHeadBar";
import SearchBar from "../../../components/Search/SearchBar";
import TextBold25 from "../../../components/Typography/TextBold25";
import UpcomingExpCard from "../../../components/Cards/UpcomingExpCard";
import PastExpTicketCard from "../../../components/Cards/PastExpTicketCard";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import { images } from "../../../constants";
import GenericFullScreenLoader from "../../../components/Loaders/GenericFullScreenLoader";

//TODO: Loader and search ability need to be added

const ExperienceLocation = () => {
  const { userId, expLocation } = useLocalSearchParams();
  const [pastTickets, setPastTickets] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const getPastTickets = async () => {
    try {
      setLoading(true); // Start loading
      const getTickets = await fetchPastCitiesTickets(userId, expLocation);
      setPastTickets(getTickets);
    } catch (error) {
      console.error("Error fetching grouped experiences:", error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    getPastTickets();
  }, [expLocation]);

  if (loading) {
    return <GenericFullScreenLoader />;
  }

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
                <AraxiaHeadBar nonTabPage />
                {/* <View>
                  <SearchBar
                    placeholder={"Search for an experience..."}
                    // initialQuery={query}
                  />
                </View> */}
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
                  <View className="w-screen p-4 items-start mt-5">
                    <View className="border-b-[2px] border-[#C796FF] w-[350px] items-center justify-center pb-3 mb-4">
                      <TextBold25
                        extraClasses="text-[#C796FF]"
                        styles={styles.glow}
                      >
                        Past Experiences in {expLocation}
                      </TextBold25>
                    </View>
                  </View>
                  <FlatList
                    horizontal={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    data={pastTickets}
                    keyExtractor={(item) => item.ticket_id}
                    renderItem={({ item }) => (
                      <PastExpTicketCard
                        experienceName={
                          item.experiencesDatabase.experience_name
                        }
                        artistId={item.experiencesDatabase.artist_id}
                        experienceId={item.experience_id}
                        banner={item.experiencesDatabase.experience_banner}
                        userId={userId}
                        ticketId={item.ticket_id}
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

export default ExperienceLocation;

const styles = StyleSheet.create({
  locationHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  experienceCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
});

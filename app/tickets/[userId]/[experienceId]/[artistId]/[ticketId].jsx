import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchUserEvent } from "../../../../../api/supabase_api";
import { icons, images } from "../../../../../constants";
import BgDarkGradient from "../../../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../../../components/BackgroundGradients/BgBlackOverlay";
import { useAuth } from "../../../../../context/AuthProvider";
import TextBold18 from "../../../../../components/Typography/TextBold18";
import TextMedium14 from "../../../../../components/Typography/TextMedium14";
import TextSemi18 from "../../../../../components/Typography/TextSemi18";
import TextRegular16 from "../../../../../components/Typography/TextRegular16";
import BuyNFTButton from "../../../../../components/Buttons/BuyNFTButton";
import GlowLetters from "../../../../../components/Typography/GlowLetters";
import GlassContainer from "../../../../../components/BackgroundContainers/GlassContainer";
import EnterGameTicket from "../../../../../components/Buttons/EnterGameTicket";

const TicketScreen = () => {
  const { userId, experienceId, artistId, ticketId } = useLocalSearchParams();
  const [upcomingExp, setUpcomingExp] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getUpcomingTickets = async () => {
    try {
      const upcomingTicket = await fetchUserEvent(
        ticketId,
        userId,
        experienceId
      );
      setUpcomingExp(upcomingTicket);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    getUpcomingTickets();
  }, [ticketId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    // Show loader while data is being fetched
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#C796FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <View className="mt-8 w-screen p-4 flex-row items-center justify-start absolute left-0 top-0 z-50">
          <TouchableOpacity onPress={handleBack}>
            <Image source={icons.backArrow} resizeMethod="contain" />
          </TouchableOpacity>
        </View>
        <BgBlackOverlay>
          <Image
            className="h-[60vh] w-screen rounded-b-[50px]"
            resizeMode="cover"
            source={{
              uri: upcomingExp?.userExperienceData[0]?.experience_banner,
            }}
          />
          <ScrollView>
            <View className="flex-col items-center w-screen h-full p-4">
              <View className="w-full flex-col items-start justify-between">
                <View className="mt-5">
                  <GlowLetters>
                    {upcomingExp?.userExperienceData[0]?.experience_name}
                  </GlowLetters>
                </View>
                <View className="flex-row mt-1">
                  <Image
                    className="h-[40px] w-[40px] rounded-full mr-4"
                    resizeMode="cover"
                    source={{
                      uri: upcomingExp?.userExperienceData[0]?.artist_avatar,
                    }}
                  />
                  <View>
                    <TextMedium14>Artist</TextMedium14>
                    <TextSemi18>
                      {upcomingExp?.userExperienceData[0]?.artist_name}
                    </TextSemi18>
                  </View>
                </View>
              </View>

              <TextRegular16 extraClasses={"mt-10"}>
                {upcomingExp?.userExperienceData[0]?.experience_description}
              </TextRegular16>

              <View>
                <EnterGameTicket
                  userId={userId}
                  artistId={artistId}
                  concertTicketId={ticketId}
                  experienceId={experienceId}
                  gameCompleted={upcomingExp?.userExperienceData[0]?.completed}
                />
              </View>

              <GlassContainer
                extraClasses="w-full items-start justify-between mt-8"
                insideContainerClasses={"p-4"}
              >
                <TextBold18 extraClasses={"pb-5 text-2xl"}>
                  Experience Stats
                </TextBold18>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Total NFTs To Capture:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {upcomingExp?.userExperienceData[0]?.experience_nfts}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Total XP:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {upcomingExp?.userExperienceData[0]?.experience_points}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Experience Type:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {upcomingExp?.userExperienceData[0]?.experience_type}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Location:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {upcomingExp?.userExperienceData[0]?.experience_city}
                    {", "}
                    {upcomingExp?.userExperienceData[0]?.experience_country}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"text-left text-lg"}>
                  Running Time:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {upcomingExp?.userExperienceData[0]?.running_time}
                  </Text>
                </TextMedium14>
              </GlassContainer>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default TicketScreen;

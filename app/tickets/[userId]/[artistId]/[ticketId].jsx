import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchUserEvent } from "../../../../api/supabase_api";
import { icons, images } from "../../../../constants";
import BgDarkGradient from "../../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../../components/BackgroundGradients/BgBlackOverlay";
import { useAuth } from "../../../../context/AuthProvider";
import TextBold25 from "../../../../components/Typography/TextBold25";
import TextMedium14 from "../../../../components/Typography/TextMedium14";
import TextSemi18 from "../../../../components/Typography/TextSemi18";
import TextRegular16 from "../../../../components/Typography/TextRegular16";
import BuyNFTButton from "../../../../components/Buttons/BuyNFTButton";

const TicketScreen = () => {
  const { userId, artistId, ticketId } = useLocalSearchParams();
  const [upcomingExp, setUpcomingExp] = useState([]);

  const getUpcomingTickets = async () => {
    try {
      const upcomingTicket = await fetchUserEvent(ticketId, userId, artistId);
      console.log(upcomingTicket);
      setUpcomingExp(upcomingTicket);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUpcomingTickets(); // Ensure function is called
  }, [ticketId]);

  const handleBack = () => {
    router.back();
  };

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
            source={{ uri: upcomingExp[0]?.experience_banner }}
          />
          <ScrollView>
            <View className="flex-col items-center w-screen h-full p-4">
              <View className="w-full flex-col items-start justify-between">
                <View className="mt-5">
                  <TextBold25>{upcomingExp[0]?.experience_name}</TextBold25>
                </View>
                <View className="flex-row mt-10">
                  <Image
                    className="h-[40px] w-[40px] rounded-full mr-4"
                    resizeMode="cover"
                    source={{ uri: upcomingExp[0]?.artist_avatar }}
                  />
                  <View>
                    <TextMedium14>Artist</TextMedium14>
                    <TextSemi18>{upcomingExp[0]?.artist_name}</TextSemi18>
                  </View>
                </View>
              </View>

              <TextRegular16 extraClasses={"mt-10 mb-5"}>
                {upcomingExp[0]?.experience_description}
              </TextRegular16>

              <View className="w-full h-[80px] place-content-center place justify-between flex-wrap border-2 border-red-500">
                <TextMedium14 extraClasses={"mr-4 text-center"}>
                  Total NFTs To Capture: {upcomingExp[0]?.experience_nfts}
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-center"}>
                  Total XP: {upcomingExp[0]?.experience_points}
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-center"}>
                  Experience Type: {upcomingExp[0]?.experience_type}
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-center"}>
                  Location: {upcomingExp[0]?.tour_location}
                </TextMedium14>
                <TextMedium14 extraClasses={"text-center"}>
                  Running Time: {upcomingExp[0]?.running_time}
                </TextMedium14>
              </View>
              <View>
                <BuyNFTButton />
              </View>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default TicketScreen;

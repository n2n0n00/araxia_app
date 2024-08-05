import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import BgDarkGradient from "../../../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../../../components/BackgroundGradients/BgBlackOverlay";
import { icons, images } from "../../../../../constants";
import TicketContainer from "../../../../../components/BackgroundContainers/TicketContainer";
import TextBold22 from "../../../../../components/Typography/TextBold22";
import TextExtra22 from "../../../../../components/Typography/TextExtra22";
import TextSemi20 from "../../../../../components/Typography/TextSemi20";
import { fetchUserEvent } from "../../../../../api/supabase_api";
import { dateReformatter } from "../../../../../utils/dateReformatter";
import { timezoneReformatter } from "../../../../../utils/timezoneReformatter";

const TicketScreen = () => {
  const { userId, experienceId, concertTicketId } = useLocalSearchParams();
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const getTicket = async () => {
    try {
      setLoading(true); // Start loading
      const ticket = await fetchUserEvent(
        concertTicketId,
        userId,
        experienceId
      );
      setTicketData(ticket);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    getTicket();
  }, [concertTicketId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
          <Image
            source={images.loginBG}
            resizeMode="contain"
            className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
          />
          <BgBlackOverlay>
            <View className="flex-1 justify-center items-center w-screen">
              <ActivityIndicator size="large" color="#C796FF" />
            </View>
          </BgBlackOverlay>
        </BgDarkGradient>
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
          <View>
            <View className="justify-center items-center w-screen h-screen p-4 pt-20">
              <TicketContainer extraClasses={"w-[300px]"}>
                <Image
                  source={{
                    uri: ticketData?.userTickets[0]?.ticket_qr,
                  }}
                  className="h-[260px] mb-1"
                  resizeMode="contain"
                />
                <TextSemi20 extraClasses={"text-purple-800 text-center"}>
                  Attendee:{" "}
                  <Text className="underline">
                    {ticketData?.userTickets[0]?.bought_by}
                  </Text>
                </TextSemi20>
                <View className="flex-row mt-2 items-center justify-between">
                  <View className="flex-col justify-between">
                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Date
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {dateReformatter(
                          ticketData?.userExperienceData[0]?.tour_date
                        )}
                      </TextSemi20>
                    </View>

                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Seat
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {ticketData?.userTickets[0]?.seat_number}
                      </TextSemi20>
                    </View>
                  </View>
                  <View className="flex-col justify-between">
                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Time
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {timezoneReformatter(
                          ticketData?.userExperienceData[0]?.tour_time
                        )}
                      </TextSemi20>
                    </View>
                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Venue
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {ticketData?.userTickets[0]?.venue}
                      </TextSemi20>
                    </View>
                  </View>
                </View>
                <View className="flex-col items-center mt-4">
                  <TextExtra22 extraClasses={"text-[#258563]"}>
                    Smart Contract Address
                  </TextExtra22>
                  <TextSemi20 extraClasses={"text-purple-500 text-center"}>
                    {ticketData?.userTickets[0]?.smart_contract_address}
                  </TextSemi20>
                </View>
              </TicketContainer>
            </View>
          </View>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default TicketScreen;

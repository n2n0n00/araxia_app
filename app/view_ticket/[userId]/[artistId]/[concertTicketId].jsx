import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchUserEvent } from "../../../../api/supabase_api";
import BgDarkGradient from "../../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../../components/BackgroundGradients/BgBlackOverlay";
import { icons, images, samples } from "../../../../constants";
import TicketContainer from "../../../../components/BackgroundContainers/TicketContainer";
import TextBold22 from "../../../../components/Typography/TextBold22";
import TextExtra22 from "../../../../components/Typography/TextExtra22";
import TextSemi20 from "../../../../components/Typography/TextSemi20";

//TODO: ARA SCAN LINK TO GO TO THE TRANSACTION AND LOADER!!!

const TicketScreen = () => {
  const { userId, artistId, concertTicketId } = useLocalSearchParams();
  const [ticketData, setTicketData] = useState([]);

  const getTicket = async () => {
    try {
      const ticket = await fetchUserEvent(concertTicketId, userId, artistId);
      setTicketData(ticket);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTicket();
  }, [concertTicketId]);

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
          <ScrollView>
            <View className="justify-center items-center w-screen h-screen p-4 pt-20">
              <TicketContainer extraClasses={"w-[300px]"}>
                <Image
                  source={{
                    uri: ticketData[0]?.ticket_qr,
                  }}
                  className="mt-36 h-[260px] mb-1"
                  resizeMode="contain"
                />
                <TextSemi20 extraClasses={"text-purple-800 text-center"}>
                  Attendee:{" "}
                  <Text className="underline">{ticketData[0]?.bought_by}</Text>
                </TextSemi20>
                <View className="flex-row mt-2 items-center justify-between">
                  <View className="flex-col justify-between">
                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Date
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {ticketData[0]?.tour_date}
                      </TextSemi20>
                    </View>

                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Seat
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {ticketData[0]?.seat_number}
                      </TextSemi20>
                    </View>
                  </View>
                  <View className="flex-col justify-between">
                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Time
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {ticketData[0]?.tour_time}
                      </TextSemi20>
                    </View>
                    <View>
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Venue
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {ticketData[0]?.venue}
                      </TextSemi20>
                    </View>
                  </View>
                </View>
                <View className="flex-col items-center mt-4">
                  <TextExtra22 extraClasses={"text-[#258563]"}>
                    Smart Contract Address
                  </TextExtra22>
                  <TextSemi20 extraClasses={"text-purple-500 text-center"}>
                    {ticketData[0]?.smart_contract_address}
                  </TextSemi20>
                </View>
              </TicketContainer>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default TicketScreen;

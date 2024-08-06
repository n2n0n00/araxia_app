import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import BgDarkGradient from "../../../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../../../components/BackgroundGradients/BgBlackOverlay";
import { icons, images } from "../../../../../constants";
import TicketContainer from "../../../../../components/BackgroundContainers/TicketContainer";
import TextBold22 from "../../../../../components/Typography/TextBold22";
import TextExtra22 from "../../../../../components/Typography/TextExtra22";
import TextSemi20 from "../../../../../components/Typography/TextSemi20";
import { fetchUserEvent } from "../../../../../api/supabase_api";
import { dateReformatter } from "../../../../../utils/dateReformatter";
import * as Clipboard from "expo-clipboard";
import { timezoneReformatter } from "../../../../../utils/timezoneReformatter";
import TextBold20 from "../../../../../components/Typography/TextBold20";
import GenericFullScreenLoader from "../../../../../components/Loaders/GenericFullScreenLoader";

const TicketScreen = () => {
  const { userId, experienceId, concertTicketId } = useLocalSearchParams();
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  //long press to copy smart contract address
  const [linkCopied, setLinkCopied] = useState(false);

  const handleLongPress = async () => {
    const smartContractAddress =
      ticketData?.userTickets[0]?.smart_contract_address;
    if (smartContractAddress) {
      await Clipboard.setStringAsync(smartContractAddress);
      setLinkCopied(true);

      // Reset after a few seconds
      setTimeout(() => setLinkCopied(false), 4000);
    } else {
      Alert.alert("Error", "No address available to copy");
    }
  };

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
                  <View className="flex-col justify-between items-end">
                    <View className="w-[90%]">
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Time
                      </TextBold22>
                      <TextSemi20 extraClasses={"text-purple-500"}>
                        {timezoneReformatter(
                          ticketData?.userExperienceData[0]?.tour_time
                        )}
                      </TextSemi20>
                    </View>
                    <View className="w-[90%]">
                      <TextBold22 extraClasses={"text-[#258563]"}>
                        Venue
                      </TextBold22>
                      <TouchableOpacity
                        onPress={() =>
                          WebBrowser.openBrowserAsync(
                            `${ticketData?.userTickets[0]?.venue_location_link}`
                          )
                        }
                      >
                        <TextBold20
                          extraClasses={"text-blue-500 text-ellipsis w-[90%]"}
                          numLines={1}
                        >
                          {ticketData?.userTickets[0]?.venue}
                        </TextBold20>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className="flex-col items-center mt-8">
                  <TextExtra22 extraClasses={"text-[#258563]"}>
                    Smart Contract Address
                  </TextExtra22>
                  <TouchableOpacity
                    onPress={() =>
                      WebBrowser.openBrowserAsync(
                        `${ticketData?.userTickets[0]?.smart_contract_address}`
                      )
                    }
                    onLongPress={handleLongPress}
                  >
                    <TextBold20
                      extraClasses={"text-blue-500 text-center text-ellipsis"}
                      numLines={1}
                    >
                      {linkCopied
                        ? "Link Copied!"
                        : ticketData?.userTickets[0]?.smart_contract_address}
                    </TextBold20>
                  </TouchableOpacity>
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

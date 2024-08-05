import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "../../constants";
import TextSemi18 from "../Typography/TextSemi18";
import { dateExtractor } from "../../utils/dateExtractor";

const MyTicketUpcomingCard = ({
  ticketLink,
  expArtist,
  expName,
  expDate,
  expLocation,
}) => {
  const shortenedDate = dateExtractor(expDate);

  return (
    <TouchableOpacity
      className="items-center justify-center h-[170px] realtive mt-5 pb-5"
      onPress={ticketLink}
    >
      <Image
        source={images.ticket}
        resizeMethod="contain"
        className="w-[400px] h-[161.83px]"
      />
      <View className="absolute right-4 top-10 flex-row w-[260px] items-start justify-between">
        <View className="flex-col w-[130px]">
          <Text
            className={
              "font-msemibold text-[15px] text-[#3D765A] mb-4 text-ellipsis"
            }
            numberOfLines={1}
          >
            {expName}
          </Text>
          <Text
            className={
              "font-msemibold text-[15px] text-[#3D765A] text-ellipsis"
            }
            numberOfLines={1}
          >
            {expLocation}
          </Text>
        </View>

        <View className="flex-col w-[130px]">
          <Text
            className={
              "font-msemibold text-[15px] text-[#3D765A]  mb-4 text-right text-ellipsis"
            }
            numberOfLines={1}
          >
            {expArtist}
          </Text>
          <Text
            className={
              "font-msemibold text-[15px] text-[#3D765A] text-right text-ellipsis"
            }
            numberOfLines={1}
          >
            {shortenedDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MyTicketUpcomingCard;

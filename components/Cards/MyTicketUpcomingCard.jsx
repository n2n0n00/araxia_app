import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "../../constants";
import TextSemi18 from "../Typography/TextSemi18";

const MyTicketUpcomingCard = ({
  ticketLink,
  expArtist,
  expName,
  expDate,
  expLocation,
}) => {
  return (
    <TouchableOpacity className="items-center justify-center h-[130px] realtive mt-5">
      <Image
        source={images.ticket}
        resizeMethod="contain"
        className="w-[300px] h-[121.37px]"
      />
      <View className="absolute right-4 top-7 flex-row w-[200px] items-start justify-between">
        <View className="flex-col w-[100px]">
          <Text className={"font-msemibold text-[15px] text-[#3D765A] mb-4"}>
            {expName}
          </Text>
          <Text className={"font-msemibold text-[15px] text-[#3D765A]"}>
            {expLocation}
          </Text>
        </View>

        <View className="flex-col w-[100px]">
          <Text
            className={
              "font-msemibold text-[15px] text-[#3D765A]  mb-4 text-right"
            }
          >
            {expArtist}
          </Text>
          <Text
            className={"font-msemibold text-[15px] text-[#3D765A] text-right"}
          >
            {expDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MyTicketUpcomingCard;

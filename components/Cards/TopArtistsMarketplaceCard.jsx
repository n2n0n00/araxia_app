import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import { EvilIcons } from "@expo/vector-icons";
import TextMedium18 from "../Typography/TextMedium18";
import TextBold25 from "../Typography/TextBold25";
import { LinearGradient } from "expo-linear-gradient";
import TextSemi18 from "../Typography/TextSemi18";

const TopArtistsMarketplaceCard = ({
  banner,
  content,
  artistName,
  cryptoAddress,
  avatar,
  price,
  getExpLink,
  expLocation,
  date,
  expName,
  //   timeStamp,
}) => {
  return (
    <GlassContainer insideContainerClasses={"py-0 px-0 mb-5"}>
      <View className="p-4 rounded-xl">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row gap-4 items-center">
            <Image
              source={avatar}
              resizeMethod="contain"
              className="bg-[#BCC2C3] w-[45px] h-[45px] rounded-full"
            />
            <View>
              <Text className="text-[13px] font-medium text-white">
                {artistName}
              </Text>
              <Text className="text-[#81999E] font-regular text-[11px]">
                {cryptoAddress}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-1">
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
          </View>
        </View>

        <Image
          source={banner}
          resizeMethod="contain"
          className="w-[333px] h-[263px] rounded-3xl"
        />
        <TextBold25 extraClasses={"text-center py-2"}>{expName}</TextBold25>
        <View>
          <Text className="text-[13px] text-white font-mregular text-center">
            {content}
          </Text>
          <View className="flex-row w-full items-center justify-evenly mt-5">
            <Text className="text-[13px] text-white font-mregular">
              <Text className="font-mbold">Date:</Text> {date}
            </Text>
            <Text className="text-[13px] text-white font-mregular">
              <Text className="font-mbold">Location:</Text> {expLocation}
            </Text>
          </View>
        </View>

        <View className="flex-row w-full items-center justify-center relative">
          <View className="relative w-[280px] bg-[#30B283] h-[50px] rounded-full mt-8">
            <View className="absolute right-[4px] top-[5px]">
              <TouchableOpacity className="w-full flex-row items-center justify-between">
                <TextSemi18 extraClasses={"pl-10"}>{price}</TextSemi18>
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={["rgba(173,218,78,1)", "rgba(48,178,131,1)"]}
                  locations={["0", "1"]}
                  className="w-[100px] h-[40px] rounded-3xl items-center justify-center"
                >
                  <TextSemi18>Get</TextSemi18>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </GlassContainer>
  );
};

export default TopArtistsMarketplaceCard;

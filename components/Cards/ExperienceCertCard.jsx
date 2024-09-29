import { Image, Text, View, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import { images } from "../../constants";
import TextExtra14 from "../Typography/TextExtra14";
import {
  getExperienceById,
  getPlayedDataByUserAndExpId,
} from "../../api/supabase_api";
import { dateReformatter } from "../../utils/dateReformatter";
import { addressShortener } from "../../utils/addressShortener";

const screenWidth = Dimensions.get("window").width;

const ExperienceCertCard = ({ experienceId, authUser }) => {
  const [experienceData, setExperienceData] = useState({});
  const [userExperienceData, setUserExperienceData] = useState({});
  const [cryptoAddressFormatted, setCryptoAddressFormatted] = useState();
  const [formattedTourDate, setFormattedTourDate] = useState();

  const getExperienceData = async () => {
    try {
      const experienceData = await getExperienceById(experienceId);
      setExperienceData(experienceData[0]); // Assuming the API returns an array

      const userExpData = await getPlayedDataByUserAndExpId(
        authUser?.userId,
        experienceId
      );

      const shortenedAddress = addressShortener(authUser?.cryptoAddress);
      const reformattedDate = dateReformatter(experienceData[0]?.tour_date);
      setUserExperienceData(userExpData[0]); // Assuming the API returns an array
      setCryptoAddressFormatted(shortenedAddress);
      setFormattedTourDate(reformattedDate);
    } catch (error) {
      console.error("Error fetching experience data:", error.message);
    }
  };

  useEffect(() => {
    getExperienceData();
  }, [experienceId, authUser?.userId]); // Dependencies to rerun effect when experienceId or authUser.userId changes

  const numColumns = experienceData?.experience_banner?.length === 1 ? 1 : 2;

  return (
    <GlassContainer insideContainerClasses={"py-0 px-0 mb-7"}>
      <View className="p-4 rounded-xl">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row gap-4 items-center">
            <Image
              source={{ uri: authUser?.avatar }}
              resizeMethod="contain"
              className="bg-[#BCC2C3] w-[45px] h-[45px] rounded-full"
            />
            <View>
              <Text className="text-[13px] font-mmedium text-white">
                {authUser?.username}
              </Text>
              <Text className="text-[#81999E] font-mregular text-[11px]">
                {cryptoAddressFormatted}
              </Text>
            </View>
          </View>
        </View>
        <View className="mb-4">
          <Text className="text-[13px] text-white font-mregular">
            {experienceData?.experience_description}
          </Text>
        </View>
        <View style={styles.photosContainer(numColumns)} className="">
          {/* {experienceData?.experience_banner.map((item, index) => ( */}
          <Image
            // key={index}
            source={{ uri: experienceData?.experience_banner }}
            style={styles.photo(numColumns)}
            resizeMethod="contain"
          />
          {/* ))} */}
        </View>
        <View className="p-4">
          <GlassContainer
            insideContainerClasses={"p-3 w-[80vw] relative bg-green-500/30"}
          >
            <Image
              source={images.XPCert}
              resizeMethod="contain"
              className="absolute left-4 top-2"
            />
            <View className="flex-col items-center justify-center">
              <TextExtra14 extraClasses={"mb-2"}>
                Experience Certificate
              </TextExtra14>
              <TextExtra14 extraClasses={"mb-4"}>
                {experienceData?.experience_name}
              </TextExtra14>
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <TextExtra14>
                  Gained XPs:{" "}
                  <TextExtra14 extraClasses={"text-red-500"}>
                    {userExperienceData?.user_metadata?.userGainedXP}/
                    {experienceData?.experience_points}
                  </TextExtra14>
                </TextExtra14>
                <TextExtra14>
                  Friends Made:{" "}
                  <TextExtra14 extraClasses={"text-red-500"}>
                    {userExperienceData?.user_metadata?.inGameFriendsMade}
                  </TextExtra14>
                </TextExtra14>
                <TextExtra14>
                  NFTs Captured:{" "}
                  <TextExtra14 extraClasses={"text-red-500"}>
                    {userExperienceData?.user_metadata?.userGainedNFTs}/
                    {experienceData?.experience_nfts}
                  </TextExtra14>
                </TextExtra14>
              </View>
              <View>
                <TextExtra14>{experienceData?.artist_name}</TextExtra14>
                <TextExtra14>{experienceData?.experience_city}</TextExtra14>
                <TextExtra14>{formattedTourDate}</TextExtra14>
              </View>
            </View>
          </GlassContainer>
        </View>
      </View>
    </GlassContainer>
  );
};

const styles = StyleSheet.create({
  // TODO: fix when posting is created
  photosContainer: (numColumns) => ({
    width: "100%",
    flexDirection: numColumns > 1 && "row",
    flexWrap: numColumns > 1 && "wrap",
    justifyContent: numColumns > 1 ? "space-between" : "center",
    alignItems: "center",
    marginBottom: 16,
  }),
  photo: (numColumns) => ({
    width: numColumns > 1 ? "100%" : (screenWidth - 64) / 2,
    height: 204,
    borderRadius: 12,
    marginBottom: 16,
  }),
});

export default ExperienceCertCard;

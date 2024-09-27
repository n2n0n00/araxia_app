import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import { images } from "../../constants";
import TextExtra14 from "../Typography/TextExtra14";
import {
  getExperienceById,
  getPlayedDataByUserAndExpId,
  getPostById,
} from "../../api/supabase_api";
import { dateReformatter } from "../../utils/dateReformatter";
import { addressShortener } from "../../utils/addressShortener";
import { EvilIcons } from "@expo/vector-icons";
import { tmzDateReformatter } from "../../utils/tmzDateReformatter";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const PostCard = ({ postId, userData }) => {
  const [postsData, setPostsData] = useState({});
  const [formattedPostDate, setFormattedPostDate] = useState();

  const getPostData = async () => {
    try {
      const postsData = await getPostById(postId);

      setPostsData(postsData[0]); // Assuming the API returns an array
      const reformattedDate = tmzDateReformatter(postsData[0]?.timestamp);
      setFormattedPostDate(reformattedDate);
    } catch (error) {
      console.error("Error fetching experience data:", error.message);
    }
  };

  useEffect(() => {
    getPostData();
  }, [postId, userData]); // Dependencies to rerun effect when postId or authUser.userId changes

  const numColumns = postsData?.media?.length === 1 ? 1 : 2;

  const handlePostRoute = () => {
    router.push(`/post/${userData.userId}/${postId}`);
  };

  return (
    <GlassContainer insideContainerClasses={"py-0 px-0 mb-7"}>
      <View className="p-4 rounded-xl">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row gap-4 items-center">
            <Image
              source={{ uri: userData?.avatar }}
              resizeMethod="contain"
              className="bg-[#BCC2C3] w-[45px] h-[45px] rounded-full"
            />
            <View>
              <Text className="text-[13px] font-mmedium text-white">
                {userData?.username}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-1">
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
          </View>
        </View>
        <TouchableOpacity onPress={handlePostRoute}>
          <View className="mb-4">
            <Text className="text-[13px] text-white font-mregular">
              {postsData?.content}
            </Text>
          </View>
          <View
            style={styles.photosContainer(numColumns)}
            className={`${postsData?.media === "NULL" && "w-0 h-0"}`}
          >
            {postsData?.media?.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item }}
                style={styles.photo(numColumns)}
                resizeMethod="contain"
              />
            ))}
          </View>
        </TouchableOpacity>
        <View className="flex-row w-full items-center justify-between">
          <View className="flex-row w-2/4 items-start justify-start gap-5">
            <View className="flex-row items-center justify-center h-[30px]">
              <EvilIcons name="comment" size={30} color="#fff" />
              <Text className="text-[#fff] font-mregular text-[15px] pt-1 pl-1">
                {postsData?.comments}
              </Text>
            </View>
            <View className="flex-row items-center justify-center h-[30px]">
              <EvilIcons name="like" size={30} color="#fff" />
              <Text className="text-[#fff] font-mregular text-[15px] pt-1">
                {postsData?.likes}
              </Text>
            </View>
          </View>
          <Text className="text-[#81999E] font-mregular text-[11px]">
            {formattedPostDate}
          </Text>
        </View>
      </View>
    </GlassContainer>
  );
};

const styles = StyleSheet.create({
  // TODO: fix when posting is created
  photosContainer: (numColumns) => ({
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: numColumns > 1 ? "space-between" : "center",
    alignItems: "center",
    marginBottom: 16,
  }),
  photo: (numColumns) => ({
    width: numColumns === 1 ? "100%" : (screenWidth - 64) / 2,
    height: 204,
    borderRadius: 12,
    marginBottom: 16,
  }),
});

export default PostCard;

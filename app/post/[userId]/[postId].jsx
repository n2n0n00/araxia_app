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
import { icons, images } from "../../../constants";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import TextBold25 from "../../../components/Typography/TextBold25";
import TextMedium18 from "../../../components/Typography/TextMedium18";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextRegular18 from "../../../components/Typography/TextRegular18";
import TextBold15 from "../../../components/Typography/TextBold15";
import BuyNFTButton from "../../../components/Buttons/BuyNFTButton";
import {
  getIndividualNFTData,
  globalNFTPageListener,
  updateFavoriteCount,
  addUserLike,
  removeUserLike,
  checkUserLike,
} from "../../../api/supabase_api";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../../../context/AuthProvider";
import GenericFullScreenLoader from "../../../components/Loaders/GenericFullScreenLoader";

const PostPage = () => {
  globalNFTPageListener();
  const { authUser } = useAuth();
  const { userId, postId } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [maximizeImage, setMaximizeImage] = useState(false);
  const [likePost, setLikePost] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleMaximizeImage = () => {
    setMaximizeImage(!maximizeImage);
  };

  const handleUserProfileRoute = (userId) => {
    if (userId === authUser.userId) {
      router.push("/profile");
    } else router.push(`/user/${userId}`);
  };

  const handleLikedPost = async () => {
    if (!likePost) {
      const likesCounter = post.favorite_count + 1;
      setLikePost(true);
      setPost({ ...post, favorite_count: likesCounter });
      await updateFavoriteCount(postId, likesCounter);
      await addUserLike(authUser.userId, postId);
    }
  };

  const handleUnlikedNFT = async () => {
    if (likePost) {
      const likesCounter = post.favorite_count - 1;
      setLikePost(false);
      setPost({ ...post, favorite_count: likesCounter });
      await updateFavoriteCount(postId, likesCounter);
      await removeUserLike(authUser.userId, postId);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [post, user] = await Promise.all([
          getPostById(postId),
          fetchUserDetails(userId),
        ]);

        setUser(user);
        setPost(post);
        const authUserLiked = await checkUserLike(authUser.userId, postId);
        setLikePost(authUserLiked);
      } catch (error) {
        console.error("Error fetching post and related data:", error.message);
      }
    };
    fetchPost();
  }, [postId, userId]);

  if (!post) {
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
        <View className="mt-8 w-screen p-4 flex-row items-center justify-between absolute left-0 top-0 z-50">
          <TouchableOpacity onPress={handleBack}>
            <Image source={icons.backArrow} resizeMethod="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleMaximizeImage}
            className="h-[40px] w-[40px] rounded-3xl bg-purple-900 items-center justify-center"
          >
            <Feather name="maximize" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <BgBlackOverlay>
          //TODO: add carousel ability later
          <Image
            className="h-[60vh] w-screen rounded-b-[50px]"
            resizeMode="cover"
            source={{ uri: post.media[0] }}
          />
          {maximizeImage ? (
            <TouchableOpacity
              className="h-screen w-screen absolute z-50 items-center justify-center"
              onPress={handleMaximizeImage}
            >
              <View className="bg-black opacity-80 h-full w-full absolute" />
              <View className="w-screen h-screen items-center justify-center">
                <Image
                  source={{ uri: post.media[0] }}
                  resizeMode="contain"
                  className="w-full h-full"
                />
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <ScrollView>
            <View className="flex-col items-center w-screen h-full p-4">
              <View className="w-full flex-row items-end justify-end">
                {likePost ? (
                  <TouchableOpacity
                    onPress={handleUnlikedNFT}
                    className="flex-row items-center"
                  >
                    <AntDesign name="heart" size={24} color="white" />
                    <TextMedium18 extraClasses={"pl-2"}>
                      {post?.favorite_count}
                    </TextMedium18>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleLikedPost}
                    className="flex-row items-center"
                  >
                    <AntDesign name="hearto" size={24} color="white" />
                    <TextMedium18 extraClasses={"pl-2"}>
                      {post?.favorite_count}
                    </TextMedium18>
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-row w-full items-start justify-between my-10">
                <View>
                  <TouchableOpacity
                    onPress={() => handleUserProfileRoute(user.userId)}
                    className="flex-row items-center mt-2"
                  >
                    <Image
                      resizeMode="cover"
                      className="w-[40px] h-[40px] rounded-full mr-2"
                      source={{ uri: user.avatar }}
                    />
                    <TextBold15>{user.username}</TextBold15>
                  </TouchableOpacity>
                </View>
                <TextRegular18 extraClasses={"mt-10 mb-5"}>
                  {post.content}
                </TextRegular18>
              </View>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default PostPage;

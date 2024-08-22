import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView, // Use ScrollView instead of FlatList
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../../../context/AuthProvider";
import GenericFullScreenLoader from "../../../components/Loaders/GenericFullScreenLoader";
import TextSemi20 from "../../../components/Typography/TextSemi20";

import {
  getPostById,
  fetchUserDetails,
  updateLikeCounterOnUserLikedPosts,
  addUserLikeOnPost,
  removeUserLikeOnPost,
  checkUserLikeOnPost,
} from "../../../api/supabase_api";
import CommentSection from "../../../components/CommentsSystem/CommentsSection";

const PostPage = () => {
  const { authUser } = useAuth();
  const { userId, postId } = useLocalSearchParams();
  const [hasMedia, setHasMedia] = useState(false);
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

  const handleUserProfileRoute = () => {
    if (userId === authUser.userId) {
      router.push("/profile");
    } else {
      router.push(`/user/${userId}`);
    }
  };

  const handleLikedPost = async () => {
    if (!likePost) {
      const likesCounter = post.favorite_count + 1;
      setLikePost(true);
      setPost((prevPost) => ({ ...prevPost, favorite_count: likesCounter }));
      await updateLikeCounterOnUserLikedPosts(postId, likesCounter);
      await addUserLikeOnPost(authUser.userId, postId);
    }
  };

  const handleUnlikedPost = async () => {
    if (likePost) {
      const likesCounter = post.favorite_count - 1;
      setLikePost(false);
      setPost((prevPost) => ({ ...prevPost, favorite_count: likesCounter }));
      await updateLikeCounterOnUserLikedPosts(postId, likesCounter);
      await removeUserLikeOnPost(authUser.userId, postId);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [postData, userData] = await Promise.all([
          getPostById(postId),
          fetchUserDetails(userId),
        ]);

        if (postData.length > 0 && userData.length > 0) {
          setPost(postData[0]);
          setUser(userData[0]);

          const authUserLiked = await checkUserLikeOnPost(
            authUser.userId,
            postId
          );
          setLikePost(authUserLiked);
          if (postData[0]?.media?.length > 0) {
            setHasMedia(true);
          }

          console.log(hasMedia);
        }
      } catch (error) {
        console.error("Error fetching post and related data:", error.message);
      }
    };

    fetchPost();
  }, [postId, userId, authUser.userId]);

  if (!post || !user) {
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

        <BgBlackOverlay>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-col items-center w-full p-4">
              <View className="mt-8 w-screen p-4 flex-row items-center justify-between absolute left-0 top-0 z-50">
                <TouchableOpacity onPress={handleBack}>
                  <Image source={icons.backArrow} resizeMethod="contain" />
                </TouchableOpacity>
                {hasMedia && (
                  <TouchableOpacity
                    onPress={handleMaximizeImage}
                    className="h-[40px] w-[40px] rounded-3xl bg-purple-900 items-center justify-center"
                  >
                    <Feather name="maximize" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>
              {hasMedia && (
                <Image
                  className="h-[60vh] w-screen rounded-b-[50px] -mt-4"
                  resizeMode="cover"
                  source={{ uri: post?.media[0] }}
                />
              )}
              {hasMedia && maximizeImage && (
                <TouchableOpacity
                  className="h-screen w-screen absolute top-0 left-0 z-50 items-center justify-center"
                  onPress={handleMaximizeImage}
                >
                  <View className="bg-black opacity-80 h-full w-full absolute" />
                  <View className="w-screen h-screen items-center justify-center">
                    <Image
                      source={{ uri: post?.media[0] }}
                      resizeMode="contain"
                      className="w-full h-full"
                    />
                  </View>
                </TouchableOpacity>
              )}

              <View
                className={`flex-row w-full items-center justify-between pt-8 ${
                  !hasMedia && "mt-14"
                }`}
              >
                <TouchableOpacity
                  onPress={() => handleUserProfileRoute(user.userId)}
                  className="flex-row items-center"
                >
                  <Image
                    resizeMode="cover"
                    className="w-[40px] h-[40px] rounded-full mr-2"
                    source={{ uri: user.avatar }}
                  />
                  <TextBold15>{user.username}</TextBold15>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (likePost) {
                      handleUnlikedPost();
                    } else {
                      handleLikedPost();
                    }
                  }}
                  className="flex-row items-center"
                >
                  <AntDesign
                    name={likePost ? "heart" : "hearto"}
                    size={24}
                    color="white"
                  />
                  <TextMedium18 extraClasses={"pl-2"}>
                    {post?.favorite_count}
                  </TextMedium18>
                </TouchableOpacity>
              </View>
              <View className="w-full">
                <TextRegular18 extraClasses={"mt-10 mb-5"}>
                  {post?.content}
                </TextRegular18>
                <View className="w-full h-[1px] bg-purple-700" />
                <TextSemi20 extraClasses={"py-4"}>Comments</TextSemi20>
              </View>
              <View className="pb-12 h-full w-full">
                <CommentSection postId={postId} />
              </View>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default PostPage;

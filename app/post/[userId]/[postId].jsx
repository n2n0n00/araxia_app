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
  addUserLikeOnPost,
  removeUserLike,
  checkUserLike,
  getPostById,
  fetchUserDetails,
  updateLikeCounterOnUserLikedPosts,
  removeUserLikeOnPost,
  checkUserLikeOnPost,
} from "../../../api/supabase_api";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../../../context/AuthProvider";
import GenericFullScreenLoader from "../../../components/Loaders/GenericFullScreenLoader";
import TextSemi20 from "../../../components/Typography/TextSemi20";
import { FlatList } from "react-native-web";

const PostPage = () => {
  const { authUser } = useAuth();
  const { userId, postId } = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
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

  const handleUnlikedNFT = async () => {
    if (likePost) {
      const likesCounter = post.favorite_count - 1;
      setLikePost(false);
      setPost((prevPost) => ({ ...prevPost, favorite_count: likesCounter }));
      await updateLikeCounterOnUserLikedPosts(postId, likesCounter);
      await removeUserLikeOnPost(authUser.userId, postId);
    }
  };

  // const fetchAndSetComments = async () => {
  //   const fetchedComments = await fetchCommentsByPostId(postId);
  //   setComments(fetchedComments);
  // };

  // const handleAddComment = async () => {
  //   if (newComment.trim()) {
  //     await addCommentToPost(postId, authUser.userId, newComment);
  //     setNewComment("");
  //     fetchAndSetComments(); // Re-fetch comments to update the list
  //   }
  // };

  // const handleLikeComment = async (commentId) => {
  //   await likeComment(commentId, authUser.userId);
  //   fetchAndSetComments(); // Re-fetch comments to update the list
  // };

  // const handleReplyToComment = async (commentId, replyText) => {
  //   await replyToComment(commentId, authUser.userId, replyText);
  //   fetchAndSetComments(); // Re-fetch comments to update the list
  // };

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
          {/* TODO: add carousel ability later */}
          <Image
            className="h-[60vh] w-screen rounded-b-[50px]"
            resizeMode="cover"
            source={{ uri: post?.media[0] }}
          />
          {maximizeImage && (
            <TouchableOpacity
              className="h-screen w-screen absolute z-50 items-center justify-center"
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
          <ScrollView>
            <View className="flex-col items-center w-screen h-full p-4">
              <View className="flex-row w-full items-center justify-between">
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
                  onPress={likePost ? handleUnlikedNFT : handleLikedPost}
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
                {/* <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderComment}
                  />
                  <View className="flex-row items-center mt-4">
                    <TextInput
                      value={newComment}
                      onChangeText={setNewComment}
                      placeholder="Add a comment..."
                      placeholderTextColor="#888"
                      className="flex-1 bg-gray-800 p-2 rounded-md text-white"
                    />
                    <TouchableOpacity onPress={handleAddComment} className="ml-2">
                      <Feather name="send" size={24} color="white" />
                    </TouchableOpacity>
                  </View> */}
              </View>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default PostPage;

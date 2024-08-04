import { useLocalSearchParams } from "expo-router";
import { fetchUserDetails, getFollowedUsers } from "../../../api/supabase_api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  View,
} from "react-native";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../../constants";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import AraxiaHeadBar from "../../../components/HeadBars/AraxiaHeadBar";
import EmptyState from "../../../components/EmptyComponent/EmptyState";
import FollowCard from "../../../components/Cards/FollowCard";

const Following = () => {
  const { userId } = useLocalSearchParams();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUsersList = async () => {
    if (userId) {
      setIsLoading(true);
      try {
        const following = await getFollowedUsers(userId);

        // Extract the user IDs from the following data
        const userIds = following.map((item) => item.user_who_was_followed_id);

        // Fetch user details for each user ID individually
        const userDetails = await Promise.all(
          userIds.map(async (id) => await fetchUserDetails(id))
        );

        const flattenedUsers = userDetails.flat();

        setUsers(flattenedUsers);
      } catch (error) {
        console.error("Error fetching following users results:", error.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getUsersList();
    }
  }, [userId]);

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop="-mt-5">
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <BgBlackOverlay>
          <View className="flex-col h-full w-full">
            <AraxiaHeadBar nonTabPage />
            {isLoading ? (
              <View className="mt-60">
                <ActivityIndicator size={80} color="#C796FF" />
              </View>
            ) : (
              <View className="flex-1 items-center justify-center w-screen">
                <FlatList
                  contentContainerStyle={{
                    width: "100%",
                    paddingHorizontal: 16, // Add some padding to avoid items sticking to the edges
                  }}
                  columnWrapperStyle={{
                    justifyContent: "space-around",
                  }}
                  showsVerticalScrollIndicator={false}
                  data={users}
                  numColumns={3}
                  keyExtractor={(item) => item.userId}
                  renderItem={({ item }) => (
                    <FollowCard
                      userName={item.username}
                      userId={item.userId}
                      userAvatar={item.avatar}
                    />
                  )}
                  ListEmptyComponent={() => (
                    <EmptyState
                      title="No Followers Yet"
                      subtitle="Be The First To Follow!"
                    />
                  )}
                />
              </View>
            )}
          </View>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Following;

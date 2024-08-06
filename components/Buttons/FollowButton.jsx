import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import {
  checkUserFollow,
  followUserFunction,
  unfollowUserFunction,
} from "../../api/supabase_api";

const FollowButton = ({ extraClasses, followedUserId, userId }) => {
  const [follow, setFollow] = useState(false);

  useEffect(() => {
    const fetchUserFollow = async () => {
      const userFollowed = await checkUserFollow(userId, followedUserId);
      setFollow(userFollowed);
    };
    if (userId && followedUserId) {
      fetchUserFollow();
    }
  }, [userId, followedUserId]);

  const handleFollowArtist = async () => {
    setFollow(true);
    await followUserFunction(userId, followedUserId);
  };

  const handleUnfollowArtist = async () => {
    setFollow(false);
    await unfollowUserFunction(userId, followedUserId);
  };

  return (
    <TouchableOpacity
      onPress={follow ? handleUnfollowArtist : handleFollowArtist}
      className={`${extraClasses}`}
    >
      <View className="p-3 rounded-3xl items-center justify-center">
        <SimpleLineIcons
          name={follow ? "user-unfollow" : "user-follow"}
          size={28}
          color="white"
        />
      </View>
    </TouchableOpacity>
  );
};

export default FollowButton;

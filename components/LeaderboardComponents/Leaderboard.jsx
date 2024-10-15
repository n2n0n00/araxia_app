// LeaderboardList.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LeaderboardCard from "../Cards/LeaderboardCard";

const Leaderboard = ({ experienceId, leaderboardData }) => {
  if (!leaderboardData || leaderboardData.length === 0) return null;

  // Sort the leaderboard data by user_rank
  const sortedData = [...leaderboardData].sort(
    (a, b) => (a.user_rank || Infinity) - (b.user_rank || Infinity)
  );

  return (
    <View className="mb-8">
      <View className="pt-8 pb-4">
        {/* <TouchableOpacity onPress={() => router.push(``)}> */}
        <Text className="font-mbold text-white text-[22px] text-center">
          {leaderboardData[0]?.experience?.experience_name ||
            "Unnamed Experience"}
        </Text>
        {/* </TouchableOpacity> */}
      </View>

      <View className="items-center justify-center">
        <View className="flex-row">
          {sortedData.slice(0, 3).map((item, index) => (
            <View
              key={item.id}
              className={`pt-12 ${index === 1 ? "pr-2 pt-16" : index === 0 ? "pr-2 " : "pt-[80px]"}`}
            >
              <LeaderboardCard
                rank={index + 1}
                highRank
                friendsAdded={item.user_friends}
                userId={item.user_id}
                XPsCaptured={item.user_xp}
              />
            </View>
          ))}
        </View>

        <View className="flex-col items-center justify-center">
          {sortedData.slice(3, 9).map((item, index) => (
            <View key={item.id} className="pt-10">
              <LeaderboardCard
                rank={index + 4}
                friendsAdded={item.user_friends}
                userId={item.user_id}
                XPsCaptured={item.user_xp}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Leaderboard;

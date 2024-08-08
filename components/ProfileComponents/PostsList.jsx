import { View, FlatList } from "react-native";
import React from "react";
import TextMedium18 from "../../components/Typography/TextMedium18";
import ExperienceCertCard from "../Cards/ExperienceCertCard";
import PostCard from "../Cards/PostCard";

const PostsList = ({ userPosts, userData }) => {
  return (
    <View className="mt-5 mb-10 items-center">
      <FlatList
        data={userPosts}
        renderItem={({ item }) => (
          <PostCard postId={item.post_id} userData={userData} />
        )}
        keyExtractor={(item) => item.post_id.toString()}
        contentContainerStyle={{
          justifyContent: "center",
          paddingTop: 10,
        }}
        ListEmptyComponent={() => (
          <TextMedium18>No Posts here yet...</TextMedium18>
        )}
      />
    </View>
  );
};

export default PostsList;

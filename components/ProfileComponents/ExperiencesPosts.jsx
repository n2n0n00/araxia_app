import { View, FlatList } from "react-native";
import React from "react";
import { dataAltPosts } from "../../constants/constants";
import TextMedium18 from "../../components/Typography/TextMedium18";
import { useState } from "react";
import ExperienceCertCard from "../Cards/ExperienceCertCard";

const ExperiencesPosts = () => {
  return (
    <View className="mt-5 mb-10 items-center">
      <FlatList
        data={dataAltPosts}
        renderItem={({ item }) => (
          <ExperienceCertCard
            content={item.content}
            artistName={item.artistName}
            cryptoAddress={item.cryptoAddress}
            comments={item.comments}
            likes={item.likes}
            timeStamp={item.timeStamp}
            avatar={item.avatar}
            photos={item.photos}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          justifyContent: "center",
          paddingTop: 10,
        }}
        ListEmptyComponent={() => (
          <TextMedium18>No Experiences here yet...</TextMedium18>
        )}
      />
    </View>
  );
};

export default ExperiencesPosts;

import { View, Text, FlatList, RefreshControl } from "react-native";
import React from "react";
import GenericPostCard from "../Cards/GenericPostCard";
import { dataPosts } from "../../constants/constants";
import TextSemi20 from "../Typography/TextSemi20";
import { useState } from "react";

const TopNFTs = ({}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(false);
    // recall exp to see if any new ones
    //  await refetch();
    setRefreshing(false);
  };

  return (
    <View className="mt-5">
      <FlatList
        data={dataPosts}
        renderItem={({ item }) => (
          <GenericPostCard
            cardType={"NFT"}
            content={item.content}
            artistName={item.artistName}
            cryptoAddress={item.cryptoAddress}
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
      />
    </View>
  );
};

export default TopNFTs;

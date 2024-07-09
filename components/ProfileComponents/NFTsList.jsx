import { View, Text, FlatList, RefreshControl, Image } from "react-native";
import React from "react";
import GenericPostCard from "../Cards/GenericPostCard";
import { dataPosts, nftsList } from "../../constants/constants";
import TextSemi20 from "../Typography/TextSemi20";
import { useState } from "react";

const NFTsList = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(false);
    // recall exp to see if any new ones
    //  await refetch();
    setRefreshing(false);
  };

  return (
    <View className="mt-5 items-center mb-12">
      <FlatList
        horizontal={false}
        numColumns={2}
        data={nftsList}
        renderItem={({ item }) => (
          <View className="p-2">
            <Image
              source={item.nftImage}
              resizeMethod="contain"
              className="w-[180px] h-[150px] rounded-3xl"
            />
          </View>
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

export default NFTsList;

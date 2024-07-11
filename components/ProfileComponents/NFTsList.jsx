import { View, FlatList, Image, TouchableOpacity } from "react-native";
import TextMedium18 from "../../components/Typography/TextMedium18";
import React from "react";
import { router } from "expo-router";

//userNFTs => NFTs that the user is owner of not creator of

const NFTsList = ({ userNFTs, userId }) => {
  return (
    <View className="mt-5 items-center mb-12">
      <FlatList
        horizontal={false}
        numColumns={2}
        data={userNFTs}
        renderItem={({ item }) => {
          const handlePress = () => {
            router.push(`/owned_nfts/${userId}/${item.id}`);
          };

          return (
            <TouchableOpacity className="p-2" onPress={handlePress}>
              <Image
                source={{ uri: item.image_url }}
                resizeMethod="contain"
                className="w-[180px] h-[150px] rounded-3xl"
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          justifyContent: "center",
          paddingTop: 10,
        }}
        ListEmptyComponent={() => (
          <TextMedium18>No NFTs here yet...</TextMedium18>
        )}
      />
    </View>
  );
};

export default NFTsList;

import { FlatList, SafeAreaView } from "react-native";
import React from "react";
import SearchCard from "../../components/Cards/SearchCard";

const SearchQuery = ({ returnedData, filter }) => {
  const keyExtractor = (item) => {
    switch (filter) {
      case "User":
      case "Artist":
        return item.userId;
      case "Experience":
        return item.experience_id;
      case "NFT":
        return item.id;
      default:
        return item.userId || item.id || item.experience_id;
    }
  };

  const getImage = (item) => {
    switch (filter) {
      case "User":
      case "Artist":
        return item.avatar;
      case "Experience":
        return item.experience_banner;
      case "NFT":
        return item.image_url;
      default:
        return null;
    }
  };

  const getName = (item) => {
    switch (filter) {
      case "User":
        return item.username;
      case "Artist":
        return item.artistName;
      case "Experience":
        return item.experience_name;
      case "NFT":
        return item.name;
      default:
        return null;
    }
  };

  const getUserOrigin = (item) => {
    switch (filter) {
      case "Experience":
        return item.artist_id;
      case "NFT":
        return item.owner_id;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 h-full pb-[70px] w-screen">
      <FlatList
        horizontal={false}
        numColumns={2}
        data={returnedData || []}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <SearchCard
            image={getImage(item)}
            name={getName(item)}
            filter={filter}
            componentId={keyExtractor(item)}
            userOriginId={getUserOrigin(item)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchQuery;

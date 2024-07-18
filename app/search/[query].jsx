import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/Search/SearchBar";
import SearchCard from "../../components/Cards/SearchCard";
import { dataAltPosts, exp } from "../../constants/constants";

// import EmptyState from "../../components/EmptyState";

const SearchQuery = ({ returnedData, filter }) => {
  return (
    <SafeAreaView className="flex-1 h-full pb-[70px] w-screen">
      <FlatList
        horizontal={false}
        numColumns={2}
        data={returnedData}
        keyExtractor={(item) => {
          filter === "User"
            ? item.userId
            : filter === "Artist"
            ? item.userId
            : filter === "Experience"
            ? item.experience_id
            : filter === "NFT" && item.id;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <SearchCard
            image={
              filter === "User"
                ? item.avatar
                : filter === "Artist"
                ? item.avatar
                : filter === "Experience"
                ? item.experience_banner
                : filter === "NFT" && item.image_url
            }
            name={
              filter === "User"
                ? item.username
                : filter === "Artist"
                ? item.artistName
                : filter === "Experience"
                ? item.experience_name
                : filter === "NFT" && item.name
            }
            filter={filter}
            categoryId={
              filter === "User"
                ? item.userId
                : filter === "Artist"
                ? item.userId
                : filter === "Experience"
                ? item.experience_id
                : filter === "NFT" && item.id
            }
          />
        )}
        // ListHeaderComponent={() => (

        // )}
        ListEmptyComponent={() => (
          <></>
          // <EmptyState
          //   title="No Videos Found"
          //   subtitle="No available videos for this search!"
          // />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchQuery;

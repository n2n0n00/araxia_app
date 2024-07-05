import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/Search/SearchBar";
import SearchCard from "../../components/Cards/SearchCard";
import { dataAltPosts, exp } from "../../constants/constants";

// import EmptyState from "../../components/EmptyState";

const SearchQuery = ({ returnedData }) => {
  //to call the function put it into a callback
  // const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  return (
    <SafeAreaView className="flex-1 h-full pb-[70px] w-screen">
      <FlatList
        horizontal={false}
        numColumns={2}
        data={exp || returnedData}
        keyExtractor={(item) => item.expName}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <SearchCard
            key={item.expName}
            source={item}
            expImage={item.expImage}
            expArtist={item.expArtist}
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

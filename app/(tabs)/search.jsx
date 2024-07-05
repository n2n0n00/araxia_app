import { View, Image, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import SearchBar from "../../components/Search/SearchBar";
import SearchQuery from "../search/[query]";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  //searchbar query searches the database
  // const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
  // then pushes the data into the searchQuery as a data?

  const onRefresh = async () => {
    setRefreshing(true);
    // Add your refetch logic  here
    setRefreshing(false);
  };

  const refetch = () => <></>;
  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <BgBlackOverlay>
          <View className="flex-col h-full w-full">
            <AraxiaHeadBar />
            <View>
              <SearchBar
                placeholder={"Search for an experience..."}
                initialQuery={query}
              />
            </View>
            <SearchQuery />
            {/* <SearchQuery returnedData={returnedQuery} /> */}
          </View>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Search;

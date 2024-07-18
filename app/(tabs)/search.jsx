import {
  View,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import SearchBar from "../../components/Search/SearchBar";
import SearchQuery from "../search/[query]";
import { useLocalSearchParams } from "expo-router";
import { searchAllTables } from "../../api/search/supabase_search";
import TextMedium18 from "../../components/Typography/TextMedium18";
import { globalSearch } from "../../constants/filters";
import TextSemi25 from "../../components/Typography/TextSemi25";

const Search = () => {
  const { query } = useLocalSearchParams();
  const [returnedData, setReturnedData] = useState([]);
  const [filter, setFilter] = useState("Artist");
  const [isLoading, setIsLoading] = useState(false);

  const getSearchResults = async () => {
    if (query && filter) {
      setIsLoading(true);
      try {
        const searchQuery = await searchAllTables(query, filter);
        setReturnedData(searchQuery || []);
      } catch (error) {
        console.error("Error fetching search results:", error.message);
        setReturnedData([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFilterPress = (filter) => () => {
    setFilter(filter);
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    if (query || filter) {
      const searchData = await getSearchResults();
      if (searchData && Object.keys(searchData).length === 0) {
        await getSearchResults();
      }
    }
  };

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
                onSearch={handleSearch}
              />
            </View>
            <View className="flex-row items-center justify-center mt-5">
              {globalSearch.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  className={`px-3 py-2 ${
                    filter === item.label ? "bg-green-600" : "bg-purple-800"
                  } rounded-full mr-2`}
                  onPress={handleFilterPress(item.label)}
                >
                  <TextMedium18>{item.label}</TextMedium18>
                </TouchableOpacity>
              ))}
            </View>
            {isLoading ? (
              <View className="mt-60">
                <ActivityIndicator size={80} color="#C796FF" />
              </View>
            ) : filter === "Artist" ? (
              <SearchQuery returnedData={returnedData} filter="Artist" />
            ) : filter === "NFT" ? (
              <SearchQuery returnedData={returnedData} filter="NFT" />
            ) : filter === "User" ? (
              <SearchQuery returnedData={returnedData} filter="User" />
            ) : filter === "Experience" ? (
              <SearchQuery returnedData={returnedData} filter="Experience" />
            ) : (
              <></>
            )}

            {isLoading === false && !query && (
              <View className="mb-[400px] w-screen items-center">
                <TextSemi25 extraClasses={"text-left text-purple-300"}>
                  {" "}
                  1. Search for something! {"\n"} 2. Choose a category! {"\n"}{" "}
                  3. Click on Search!
                </TextSemi25>
              </View>
            )}

            {isLoading === false && query && returnedData.length === 0 ? (
              <View className="mb-[400px] w-screen items-center">
                <TextSemi25 extraClasses={"text-center"}>
                  Hmmm, no results. {"\n"} Try something else!
                </TextSemi25>
              </View>
            ) : (
              <></>
            )}
          </View>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Search;

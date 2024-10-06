import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";

import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import { useAuth } from "../../context/AuthProvider";
import SearchBar from "../../components/Search/SearchBar";
import LeaderboardCard from "../../components/Cards/LeaderboardCard";
import { fetchFandoms } from "../../api/supabase_api";
import {
  fetchLeaderboardData,
  getExperienceLocations,
} from "../../api/leaderboards/supabase_leaderboards";
import { router } from "expo-router";

const Feed = () => {
  const [filter, setFilter] = useState(false);
  const [preferredLocation, setPreferredLocation] = useState([]);
  const [preferredFandom, setPreferredFandom] = useState([]);
  const [fandomNamesList, setFandomNamesList] = useState([]);
  const [fandomLocationsNameList, setFandomLocationsNameList] = useState([]);
  const [fandomChoices, setFandomChoices] = useState([]);
  const [locationChoices, setLocationChoices] = useState([]);
  const [results, setResults] = useState([]);

  const fetchFandomChoices = async () => {
    const fandomNames = await fetchFandoms();
    setFandomNamesList(fandomNames);
    setFandomChoices(new Array(fandomNames.length).fill(false));
  };

  const fetchFandomLocations = async () => {
    const allLocations = await getExperienceLocations();
    setFandomLocationsNameList(allLocations);
    setLocationChoices(new Array(allLocations.length).fill(false));
  };

  useEffect(() => {
    fetchFandomChoices();
    fetchFandomLocations();
  }, []);

  const toggleCheckbox = (index, setChoices, choices) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = !updatedChoices[index];
    setChoices(updatedChoices);
  };

  const handlePreferencesFandom = (checkedFandom) => {
    setPreferredFandom((prev) => {
      if (prev.includes(checkedFandom)) {
        return prev.filter((fandom) => fandom !== checkedFandom);
      } else {
        return [...prev, checkedFandom];
      }
    });
  };

  const handlePreferencesLocation = (checkedLocation) => {
    setPreferredLocation((prev) => {
      if (prev.includes(checkedLocation)) {
        return prev.filter((location) => location !== checkedLocation);
      } else {
        return [...prev, checkedLocation];
      }
    });
  };

  const handleOpenFilterModal = () => {
    setFilter(!filter);
  };

  // This useEffect will trigger search every time preferredLocation or preferredFandom changes
  useEffect(() => {
    if (preferredLocation.length > 0 || preferredFandom.length > 0) {
      searchDBParams();
    }
  }, [preferredLocation, preferredFandom]);

  const searchDBParams = async () => {
    console.log("Preferred Locations:", preferredLocation);
    console.log("Preferred Fandoms:", preferredFandom);

    const resultsData = await fetchLeaderboardData(
      preferredLocation,
      preferredFandom
    );
    if (resultsData) {
      console.log("Leaderboard Data:", resultsData);
      setResults(resultsData); // Set results data to state
    } else {
      console.log("No data found or an error occurred.");
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
          <AraxiaHeadBar />
          <View className="pt-4">
            <SearchBar
              placeholder={"Search for an experience..."}
              initialQuery={null}
              setFilter={handleOpenFilterModal}
              leaderboardSearch
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={null}
            keyExtractor={(item) => item.experience_id}
            renderItem={null}
            ListHeaderComponentStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            ListHeaderComponent={
              <View className="pt-8 pb-16">
                <Text className="font-mbold text-white text-[22px] text-center">
                  John Smith’s: Winter Wonderland Quest
                </Text>
              </View>
            }
            ListFooterComponent={
              <View className="items-center justify-center">
                <View className="flex-row">
                  <View className="pr-2 pt-6">
                    <LeaderboardCard rank={2} highRank />
                  </View>
                  <View className="pr-2">
                    <LeaderboardCard rank={1} highRank />
                  </View>
                  <View className="pt-10">
                    <LeaderboardCard rank={3} highRank />
                  </View>
                </View>
                <View className="flex-col items-center justify-center">
                  <View className="pt-10">
                    <LeaderboardCard
                      rank={3}
                      userAddress={"randomshit"}
                      username={"randomshit"}
                    />
                  </View>
                  <View className="pt-2">
                    <LeaderboardCard
                      rank={4}
                      userAddress={"randomshit"}
                      username={"randomshit"}
                    />
                  </View>
                </View>
              </View>
            }
          />
          {filter && (
            <View className="absolute top-52 right-6 h-[650px] w-[400px] bg-purple-950 rounded-3xl items-center justify-center flex-col">
              {/* Fandom Section */}
              <View>
                <Text className="text-white font-bold text-lg">Fandom</Text>
                <View>
                  {fandomNamesList.map((fandom, index) => (
                    <TouchableOpacity
                      key={index}
                      className="flex-row items-center space-x-2 mt-2"
                      onPress={() => {
                        toggleCheckbox(index, setFandomChoices, fandomChoices);
                        handlePreferencesFandom(fandom.fandom_id);
                      }}
                    >
                      <View
                        className={`h-6 w-6 border-2 rounded ${
                          fandomChoices[index]
                            ? "bg-green-500"
                            : "bg-transparent"
                        } justify-center items-center`}
                      >
                        {fandomChoices[index] && (
                          <Text className="text-white text-sm">✓</Text>
                        )}
                      </View>
                      <Text className="text-white">{fandom.fandom_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location Section */}
              <View className="mt-6">
                <Text className="text-white font-bold text-lg">Location</Text>
                <View>
                  {fandomLocationsNameList.map((location, index) => (
                    <TouchableOpacity
                      key={index}
                      className="flex-row items-center space-x-2 mt-2"
                      onPress={() => {
                        toggleCheckbox(
                          index,
                          setLocationChoices,
                          locationChoices
                        );
                        handlePreferencesLocation(location.experience_city);
                      }}
                    >
                      <View
                        className={`h-6 w-6 border-2 rounded ${
                          locationChoices[index]
                            ? "bg-green-500"
                            : "bg-transparent"
                        } justify-center items-center`}
                      >
                        {locationChoices[index] && (
                          <Text className="text-white text-sm">✓</Text>
                        )}
                      </View>
                      <Text className="text-white">
                        {location.experience_city},{" "}
                        {location.experience_country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Search Section */}
              <TouchableOpacity className="mt-6" onPress={searchDBParams}>
                <Text className="text-white font-bold text-lg">Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Feed;

import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";

import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import SearchBar from "../../components/Search/SearchBar";
import LeaderboardCard from "../../components/Cards/LeaderboardCard";
import { fetchFandoms } from "../../api/supabase_api";
import {
  fetchLeaderboardData,
  getExperienceLocations,
} from "../../api/leaderboards/supabase_leaderboards";
import Leaderboard from "../../components/LeaderboardComponents/Leaderboard";

const Feed = () => {
  const [filter, setFilter] = useState(false);
  const [preferredLocation, setPreferredLocation] = useState([]);
  const [preferredFandom, setPreferredFandom] = useState([]);
  const [fandomNamesList, setFandomNamesList] = useState([]);
  const [fandomLocationsNameList, setFandomLocationsNameList] = useState([]);
  const [fandomChoices, setFandomChoices] = useState([]);
  const [locationChoices, setLocationChoices] = useState([]);
  const [results, setResults] = useState([]);
  const [isInitialFetch, setIsInitialFetch] = useState(true); // Track if it's the first fetch

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

  // useEffect(() => {
  //   fetchFandomChoices();
  //   fetchFandomLocations();
  //   console.log(fandomNamesList);
  //   console.log(fandomLocationsNameList);
  //   setPreferredLocation(fandomLocationsNameList);
  //   setPreferredFandom(fandomNamesList);
  //   searchDBParams();
  // }, []);

  useEffect(() => {
    const initializeFeed = async () => {
      try {
        const fandoms = await fetchFandoms();
        const locations = await getExperienceLocations();

        if (fandoms.length > 0 && locations.length > 0) {
          setFandomNamesList(fandoms);
          setFandomLocationsNameList(locations);

          setPreferredFandom([fandoms[0].fandom_id]);
          setPreferredLocation([locations[0].experience_city]);

          const resultData = await fetchLeaderboardData(
            [locations[0].experience_city],
            [fandoms[0].fandom_id]
          );

          if (resultData.error) {
            console.error("Error:", resultData.error);
          } else {
            setResults(resultData.data);
          }
        }
      } catch (error) {
        console.error("Unexpected error during initialization:", error);
      }
    };

    initializeFeed();
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

  const searchDBParams = async () => {
    try {
      const resultData = await fetchLeaderboardData(
        preferredLocation,
        preferredFandom
      );

      if (resultData.error) {
        console.error("Error:", resultData.error);
        return;
      }

      if (Object.keys(resultData.data).length === 0) {
        console.log(resultData.message || "No results found");
        return;
      }

      setResults(resultData.data);
      setFilter(false);
    } catch (error) {
      console.error("Unexpected error:", error);
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
          <View className="h-[85vh] pb-16">
            <FlatList
              showsVerticalScrollIndicator={false}
              data={Object.entries(results)}
              renderItem={({ item }) => {
                const [experienceId, leaderboardData] = item;
                return (
                  <Leaderboard
                    key={experienceId}
                    experienceId={experienceId}
                    leaderboardData={leaderboardData}
                  />
                );
              }}
              keyExtractor={([experienceId]) => experienceId}
            />
          </View>

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

import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, usePathname } from "expo-router";

const SearchBar = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  initialQuery,
  ...props
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <GlassContainer
      insideContainerClasses={"flex-row items-center justify-between py-3 px-4"}
    >
      <TouchableOpacity
        className="pr-5"
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results!"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <FontAwesome name="search" size={24} color="white" />
      </TouchableOpacity>
      <TextInput
        className="flex-1 text-white font-mregular mt-0.5 text-base"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#cdcde0"
        onChangeText={(e) => setQuery(e)}
      />
    </GlassContainer>
  );
};

export default SearchBar;

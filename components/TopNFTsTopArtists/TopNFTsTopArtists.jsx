import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import TextBold25 from "../../components/Typography/TextBold25";
import TextSemi25 from "../Typography/TextSemi25";

const TopNFTsTopArtists = () => {
  const [currentTab, setCurrentTab] = useState("Posts");

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between w-full border-b-[1px] border-[#C796FF]">
        <TouchableOpacity onPress={() => handleTabChange("Posts")}>
          {currentTab === "Posts" ? (
            <View className="border-b-[1px] border-[#C796FF] w-[150px] items-center">
              <TextBold25 extraClasses="text-[#C796FF]">Top NFTs</TextBold25>
            </View>
          ) : (
            <View className="w-[150px] items-center">
              <TextSemi25 className="text-white">Top NFTs</TextSemi25>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange("Collections")}>
          {currentTab === "Collections" ? (
            <View className="border-b-[1px] border-[#C796FF] w-[150px] items-center">
              <TextBold25 extraClasses="text-[#C796FF]">Top Artists</TextBold25>
            </View>
          ) : (
            <View className="w-[150px] items-center">
              <TextSemi25 className="text-white">Top Artists</TextSemi25>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        {/* {currentTab === "Posts" ? <Posts /> : <Collections />} */}
      </View>
    </View>
  );
};

export default TopNFTsTopArtists;

import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextBold25 from "../Typography/TextBold25";
import TextSemi25 from "../Typography/TextSemi25";

const TabsInterface = ({
  tabLeft,
  tabRight,
  tabLeftComponent,
  tabRightComponent,
  tabLeftLabel,
  tabRightLabel,
}) => {
  const [currentTab, setCurrentTab] = useState(tabLeft);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-around w-screen border-b-[1px] border-[#C796FF]">
        <TouchableOpacity onPress={() => handleTabChange("TopNFTs")}>
          {currentTab === "TopNFTs" ? (
            <View className="border-b-[2px] border-[#C796FF] w-[195px] items-center justify-center pb-3">
              <TextBold25 extraClasses="text-[#C796FF]" styles={styles.glow}>
                {tabLeftLabel}
              </TextBold25>
            </View>
          ) : (
            <View className="w-[195px] items-center pb-3">
              <TextSemi25 className="text-white">{tabLeftLabel}</TextSemi25>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange("TopArtists")}>
          {currentTab === "TopArtists" ? (
            <View className="border-b-[2px] border-[#C796FF] w-[195px] items-center pb-3">
              <TextBold25 extraClasses="text-[#C796FF]" styles={styles.glow}>
                {tabRightLabel}
              </TextBold25>
            </View>
          ) : (
            <View className="w-[195px] items-center pb-3">
              <TextSemi25 className="text-white">{tabRightLabel}</TextSemi25>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        {currentTab === tabLeft ? tabLeftComponent : tabRightComponent}
      </View>
    </View>
  );
};

export default TabsInterface;

const styles = StyleSheet.create({
  glow: {
    textShadowColor: "#C796FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import TextSemi18 from "../Typography/TextSemi18";

const FandomCard = ({ currentFandom, isUserArtist }) => {
  //   const handleFandomRoute = () => {
  // router.push()
  //   }
  const userIsArtist = () => (
    <TouchableOpacity>
      <GlassContainer
        insideContainerClasses={"flex-col items-center justify-center p-0 mt-6"}
      >
        <View className="py-2 w-full items-center">
          <TextSemi18>
            Fandom Data:{" "}
            <Text className="text-purple-400 font-mextrabold text-lg uppercase">
              {currentFandom}
            </Text>
          </TextSemi18>
        </View>
      </GlassContainer>
    </TouchableOpacity>
  );
  const userIsNotArtist = () => (
    <TouchableOpacity>
      <GlassContainer
        insideContainerClasses={"flex-col items-center justify-center p-0 mt-6"}
      >
        <View className="py-2 w-full items-center">
          <TextSemi18>
            Current Fandom:{" "}
            <Text className="text-purple-400 font-mextrabold text-lg uppercase">
              {currentFandom}
            </Text>
          </TextSemi18>
        </View>
      </GlassContainer>
    </TouchableOpacity>
  );

  return isUserArtist ? userIsArtist() : userIsNotArtist();
};

export default FandomCard;

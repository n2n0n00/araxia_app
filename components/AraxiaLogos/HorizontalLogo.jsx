import { View, Image } from "react-native";
import React from "react";
import { images } from "../../constants";

const HorizontalLogo = () => {
  return (
    <View>
      <Image
        source={images.HorizontalLogo}
        resizeMethod="contain"
        // className="h-[244px] w-[250px]"
      />
    </View>
  );
};

export default HorizontalLogo;

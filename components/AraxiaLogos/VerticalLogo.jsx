import { View, Image } from "react-native";
import React from "react";
import { images } from "../../constants";

const VerticalLogo = () => {
  return (
    <View>
      <Image
        source={images.logo}
        resizeMethod="contain"
        className="h-[244px] w-[250px]"
      />
    </View>
  );
};

export default VerticalLogo;

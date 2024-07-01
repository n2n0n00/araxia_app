import { View, Image } from "react-native";
import React from "react";
import { images } from "../../constants";

const VerticalLogo = () => {
  return (
    <View>
      <Image
        source={images.VerticalLogo}
        resizeMethod="contain"
        className="w-[200px]"
      />
    </View>
  );
};

export default VerticalLogo;

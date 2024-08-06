import {
  View,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import React from "react";
import BgDarkGradient from "../BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../BackgroundGradients/BgBlackOverlay";
import { images } from "../../constants";

const GenericFullScreenLoader = () => {
  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <BgBlackOverlay>
          <View className="flex-1 justify-center items-center w-screen">
            <ActivityIndicator size={80} color="#C796FF" />
          </View>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default GenericFullScreenLoader;

import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import VerticalLogo from "../../components/AraxiaLogos/VerticalLogo";
import GlassContainer from "../../components/BackgroundContainers/GlassContainer";
import TextExtra30 from "../../components/Typography/TextExtra30";

import { images } from "../../constants";
import GradientImageText from "../../components/Typography/GradientImageText";
import InputButton from "../../components/Buttons/InputButton";
import OnboardingButtons from "../../components/Buttons/OnboardingButtons";
import { router } from "expo-router";
import SocialButton from "../../components/Buttons/SocialButton";
import { SocialMedia } from "../../constants/constants";

const SafetyVideo = () => {
  return (
    <BgDarkGradient
      extraClasses={
        "flex-col justify-between h-full w-full p-4 items-center relative"
      }
    >
      <Image source={images.loginBG} className="absolute -bottom-1" />
      <GradientImageText image={images.videoSafety} />
      <GlassContainer
        extraClasses={"mt-10"}
        insideContainerClasses={
          "bg-white/40 border-2 border-purple-400 h-[60vh]"
        }
      ></GlassContainer>
      <View className="items-end w-full mt-12">
        <OnboardingButtons
          textClasses={"font-mbold text-2xl"}
          extraClasses={"w-[60%]"}
          onPress={() => router.push("sign-up")}
        >
          Next Step
        </OnboardingButtons>
      </View>
    </BgDarkGradient>
  );
};

export default SafetyVideo;

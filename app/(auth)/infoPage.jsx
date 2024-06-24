import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import HorizontalLogo from "../../components/AraxiaLogos/HorizontalLogo";
import GlassContainer from "../../components/BackgroundContainers/GlassContainer";
import TextExtra30 from "../../components/Typography/TextExtra30";

import { images } from "../../constants";
import GradientImageText from "../../components/Typography/GradientImageText";
import InputButton from "../../components/Buttons/InputButton";
import OnboardingButtons from "../../components/Buttons/OnboardingButtons";
import { router } from "expo-router";
import SocialButton from "../../components/Buttons/SocialButton";
import { SocialMedia } from "../../constants/constants";
import TextBold25 from "../../components/Typography/TextBold25";

const InfoPage = () => {
  return (
    <BgDarkGradient
      extraClasses={
        "flex-col justify-between h-full w-full p-4 items-center relative "
      }
    >
      <Image source={images.loginBG} className="absolute -bottom-1" />
      <HorizontalLogo />
      <View className="w-full my-20 flex-col items-start">
        <GradientImageText image={images.safetyText} />
        <OnboardingButtons
          textClasses={"font-msemibold text-xl"}
          extraClasses={"w-full mt-20"}
          onPress={() => router.push("./sign-up")}
        >
          Used a crypto wallet before?
        </OnboardingButtons>
        <OnboardingButtons
          textClasses={"font-msemibold text-xl"}
          extraClasses={"w-full mt-10"}
          onPress={() => router.push("./safetyVideo")}
        >
          Never Used A Crypto Wallet Before?
        </OnboardingButtons>
      </View>

      <View className="items-start max-h-full w-full mt-32">
        <TextBold25 extraClasses="pb-4">Already A User?</TextBold25>
        <OnboardingButtons
          textClasses={"font-mbold text-2xl"}
          extraClasses={"w-full mt-5"}
          onPress={() => router.push("./sign-in")}
        >
          Login With Email
        </OnboardingButtons>
      </View>
    </BgDarkGradient>
  );
};

export default InfoPage;

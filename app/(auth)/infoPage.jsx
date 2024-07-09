import { View, Image } from "react-native";
import React from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import HorizontalLogo from "../../components/AraxiaLogos/HorizontalLogo";

import { images } from "../../constants";
import OnboardingButtons from "../../components/Buttons/OnboardingButtons";
import { router } from "expo-router";

import TextBold25 from "../../components/Typography/TextBold25";

const InfoPage = () => {
  return (
    <BgDarkGradient
      extraClasses={
        "flex-col justify-between h-screen w-screen p-4 items-center relative mt-10"
      }
    >
      <Image source={images.loginBG} className="absolute -bottom-1" />
      <HorizontalLogo />
      <View className="w-full my-5 flex-col items-start">
        {/* <GradientImageText image={images.safetyText} /> */}
        <TextBold25>To Ensure Your Safety Choose One From Below</TextBold25>
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

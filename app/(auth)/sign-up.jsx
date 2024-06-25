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

const SignUp = () => {
  return (
    <BgDarkGradient
      extraClasses={"flex-col h-full w-full p-4 items-center relative"}
    >
      <Image source={images.loginBG} className="absolute -bottom-1" />
      <GradientImageText image={images.signupWithGradient} />
      <GlassContainer extraClasses={"mt-8"}>
        <View className="w-full flex-col items-center">
          <View className="relative py-10">
            <GradientImageText
              image={images.email}
              extraClasses={"absolute z-10 -top-2 left-5"}
            />
            <InputButton extraClasses={"relative"}>
              <TextInput className="h-[50px] w-[75vw] text-black/50 font-psemibold px-5 font-mmedium text-xl" />
            </InputButton>
          </View>
          <View className="relative">
            <GradientImageText
              image={images.password}
              extraClasses={"absolute z-10 -top-2 left-5"}
            />
            <InputButton extraClasses={"relative"}>
              <TextInput className="h-[50px] w-[75vw] text-black/50 font-psemibold px-5 font-mmedium text-xl" />
            </InputButton>
          </View>

          <View className="items-end w-full mt-10">
            <OnboardingButtons
              textClasses={"font-mbold text-2xl"}
              extraClasses={"w-[60%]"}
              onPress={() => router.push("seedPhrase")}
            >
              Sing Up
            </OnboardingButtons>
          </View>
        </View>
      </GlassContainer>

      <GlassContainer extraClasses={"pt-20"}>
        <GradientImageText image={images.loginGradient} />

        <View className="flex-row w-full items-center justify-between mt-5">
          {SocialMedia.map((social) => (
            <SocialButton
              button={social.icon}
              route={() => router.push(social.route)}
              alt={social.alt}
              key={social.alt}
            />
          ))}
        </View>
      </GlassContainer>

      <OnboardingButtons
        textClasses={"font-msemibold text-xl"}
        extraClasses={"w-full mt-5"}
        onPress={() => router.push("./safetyVideo")}
      >
        Never used a crypto wallet before?
      </OnboardingButtons>
    </BgDarkGradient>
  );
};

export default SignUp;

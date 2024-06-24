import { View, Text, Image } from "react-native";
import React from "react";
import OnboardingButtons from "../../components/Buttons/OnboardingButtons";
import TextBold25 from "../../components/Typography/TextBold25";
import TextSemi25 from "../../components/Typography/TextSemi25";
import SocialButton from "../../components/Buttons/SocialButton";
import { SocialMedia } from "../../constants/constants";
import { router } from "expo-router";
import VerticalLogo from "../../components/AraxiaLogos/VerticalLogo";
import { images } from "../../constants";
import { StatusBar } from "expo-status-bar";

const Onboarding = () => {
  return (
    <View className="flex-col justify-evenly h-screen w-full p-4 items-center relative">
      <Image
        source={images.onboardingBG}
        resizeMode="cover"
        className="w-screen h-screen absolute top-0 mt-5 rounded-3xl"
      />

      <VerticalLogo />
      <View className="items-start max-h-full w-full">
        <TextBold25 extraClasses="pb-4">Already A User?</TextBold25>
        <OnboardingButtons
          extraClasses={"w-full mt-5"}
          onPress={() => router.push("./sign-in")}
        >
          Login With Email
        </OnboardingButtons>
      </View>

      <View className="items-center max-h-full w-full">
        <TextSemi25>Login with...</TextSemi25>
        <View className="flex-row w-full items-center justify-evenly mt-5">
          {SocialMedia.map((social) => (
            <SocialButton
              button={social.icon}
              route={() => router.push(social.route)}
              alt={social.alt}
              key={social.alt}
            />
          ))}
        </View>
      </View>

      <View className="items-center max-h-full w-full">
        <TextBold25>Don't have an account?</TextBold25>
        <OnboardingButtons
          extraClasses={"w-full mt-5"}
          onPress={() => router.push("./sign-up")}
        >
          Sign Up
        </OnboardingButtons>
      </View>
      <StatusBar backgroundColor="#000" style="light" />
    </View>
  );
};

export default Onboarding;

import { View, Image, TextInput, AppState, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import VerticalLogo from "../../components/AraxiaLogos/VerticalLogo";
import GlassContainer from "../../components/BackgroundContainers/GlassContainer";
import { images } from "../../constants";
import GradientImageText from "../../components/Typography/GradientImageText";
import InputButton from "../../components/Buttons/InputButton";
import OnboardingButtons from "../../components/Buttons/OnboardingButtons";
import { router } from "expo-router";
import SocialButton from "../../components/Buttons/SocialButton";
import { SocialMedia } from "../../constants/constants";
import { supabase } from "../../api/supabase";
import { signInWithEmail, supabaseSignUp } from "../../api/supabase_api";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    await signInWithEmail(email, password);
    setLoading(false);
    router.push("feed");
  };

  return (
    <BgDarkGradient
      extraClasses={
        "flex-col justify-between h-full w-full p-4 items-center relative"
      }
    >
      <Image source={images.loginBG} className="absolute -bottom-1" />
      <VerticalLogo />

      <GlassContainer extraClasses={"mt-4"}>
        <View className="w-full flex-col items-center">
          <GradientImageText image={images.login} />

          <View className="relative py-5">
            <GradientImageText
              image={images.email}
              extraClasses={"absolute z-10 -top-2 left-5"}
            />
            <InputButton extraClasses={"relative"}>
              <TextInput
                className="h-[50px] w-[75vw] text-black/50 font-psemibold px-5 font-mmedium text-xl"
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={"none"}
              />
            </InputButton>
          </View>
          <View className="relative">
            <GradientImageText
              image={images.password}
              extraClasses={"absolute z-10 -top-2 left-5"}
            />
            <InputButton extraClasses={"relative"}>
              <TextInput
                className="h-[50px] w-[75vw] text-black/50 font-psemibold px-5 font-mmedium text-xl"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="**********"
                autoCapitalize={"none"}
              />
            </InputButton>
          </View>

          <View className="items-end w-full mt-10">
            <OnboardingButtons
              textClasses={"font-mbold text-2xl"}
              extraClasses={"w-[60%]"}
              onPress={() => handleSignIn()}
            >
              Login
            </OnboardingButtons>
          </View>
        </View>
      </GlassContainer>

      <GlassContainer extraClasses={"pt-5"}>
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
    </BgDarkGradient>
  );
};

export default SignIn;

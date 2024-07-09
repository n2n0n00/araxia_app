import { View, Image, TextInput, AppState, Alert } from "react-native";
import React, { useState } from "react";
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
import { useAuth } from "../../context/AuthProvider";

const SignIn = () => {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { success, message } = await signInWithEmail(email, password);
      if (success) {
        setLoading(false);
        router.push("/feed");
      } else {
        Alert.alert("Sign In Error", message);
      }
    } catch (error) {
      Alert.alert("Sign In Error", error.message);
    }
  };

  return (
    <BgDarkGradient
      extraClasses={
        "flex-col justify-between h-screen w-screen p-4 items-center relative"
      }
      linearGradientMarginTop={"mt-6"}
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

        <View className="flex-row w-full items-center justify-between mt-2">
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

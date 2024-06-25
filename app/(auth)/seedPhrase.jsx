import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Touchable,
} from "react-native";
import React, { useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import VerticalLogo from "../../components/AraxiaLogos/VerticalLogo";
import GlassContainer from "../../components/BackgroundContainers/GlassContainer";
import TextExtra30 from "../../components/Typography/TextExtra30";
import TextBold25 from "../../components/Typography/TextBold25";
import TextMedium18 from "../../components/Typography/TextMedium18";
import { images } from "../../constants";
import GradientImageText from "../../components/Typography/GradientImageText";
import InputButton from "../../components/Buttons/InputButton";
import OnboardingButtons from "../../components/Buttons/OnboardingButtons";
import { router } from "expo-router";
import SocialButton from "../../components/Buttons/SocialButton";
import { SocialMedia } from "../../constants/constants";
import * as Clipboard from "expo-clipboard";

const dataDummy = [
  "word1",
  "word2",
  "word3",
  "word4",
  "word5",
  "word6",
  "word7",
  "word8",
  "word9",
  "word10",
  "word11",
  "word12",
];

const WordComponent = () => (
  <FlatList
    data={dataDummy}
    renderItem={({ item }) => (
      <View
        className="relative justify-center items-center py-7 px-9"
        key={item}
      >
        <Image source={images.cryptoWord} className="absolute" />
        <Text className="text-white font-psemibold font-mmedium text-center text-xl">
          {item}
        </Text>
      </View>
    )}
    keyExtractor={(item) => item}
    numColumns={3}
    contentContainerStyle={{
      justifyContent: "center",
      alignItems: "center",
    }}
  />
);

const SeedPhrase = () => {
  const [agreed, setAgreed] = useState(false);

  const onTick = () => {
    setAgreed((prev) => !prev);
  };

  const copyWords = async () => {
    const copiedText = dataDummy.join(" ");
    await Clipboard.setStringAsync(copiedText);
    Alert.alert("Copied!", "Words have been copied to the clipboard.");
  };

  return (
    <BgDarkGradient
      extraClasses={
        "flex-col justify-between h-full w-full p-4 mt-10 items-center relative"
      }
    >
      <TextBold25 extraClasses={"pt-10"}>Save Your Seed Phrase</TextBold25>

      <TextMedium18 extraClasses={"capitalize text-center pt-10"}>
        Make sure you copy and write it down somewhere you won’t lose it. You’ll
        be asked to re-enter that phrase in order on the next step.
      </TextMedium18>

      <View className="flex-1 h-full pt-10">
        <WordComponent />
      </View>

      <TouchableOpacity onPress={copyWords}>
        <Image source={images.copyWords} />
      </TouchableOpacity>

      <View className="flex-row items-start justify-center pt-10 px-8">
        <TouchableOpacity className="pr-4 pt-1" onPress={onTick}>
          {agreed === true ? (
            <Image source={images.agreementTicked} />
          ) : (
            <Image source={images.agreementUnticked} />
          )}
        </TouchableOpacity>

        <TextMedium18 extraClasses={"capitalize text-left"}>
          I understand that I stand at the risk of losing my funds by sharing my
          Keys with others
        </TextMedium18>
      </View>

      <View className="items-end w-full pb-2 pt-4">
        <OnboardingButtons
          textClasses={"font-mbold text-2xl"}
          extraClasses={"w-[60%]"}
          onPress={() => {
            if (agreed === true) {
              router.push("feed");
            }
          }}
        >
          Next Step
        </OnboardingButtons>
      </View>
    </BgDarkGradient>
  );
};

export default SeedPhrase;

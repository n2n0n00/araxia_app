import { View, Text } from "react-native";
import React from "react";
import OnboardingButtons from "../../components/Buttons/OnboardingButtons";
import TextBold25 from "../../components/Typography/TextBold25";

const Onboarding = () => {
  return (
    <View className="flex-col items-start">
      <TextBold25 extraClasses="pb-4">Already A User?</TextBold25>
      <OnboardingButtons title={"Login With Email"} />
    </View>
  );
};

export default Onboarding;

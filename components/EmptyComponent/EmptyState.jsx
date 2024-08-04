import { Image, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4 pt-40">
      <FontAwesome name="binoculars" size={50} color="white" />
      <Text className="text-2xl font-msemibold text-white mt-2">{title}</Text>
      <Text className="font-mmedium text-lg text-gray-100">{subtitle}</Text>
      {/* <CustomButton
        title="Create Video"
        handlePress={() => router.push("/create")}
        containerStyles={"w-full my-5"}
      /> */}
    </View>
  );
};

export default EmptyState;

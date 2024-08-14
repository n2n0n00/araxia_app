import { Image, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const EmptyState = ({ title, subtitle, comments }) => {
  return (
    <View
      className={`justify-center items-center px-4 pt-40 ${
        comments && `pb-40`
      }`}
    >
      <FontAwesome name="binoculars" size={50} color="white" />
      <Text className="text-2xl font-msemibold text-white mt-2">{title}</Text>
      <Text className="font-mmedium text-lg text-gray-100">{subtitle}</Text>
    </View>
  );
};

export default EmptyState;

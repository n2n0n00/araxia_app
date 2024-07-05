import { Image, Text, View, StyleSheet, Dimensions } from "react-native";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import { EvilIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const GenericPostCard = ({
  photos,
  content,
  artistName,
  cryptoAddress,
  avatar,
  comments,
  likes,
  timeStamp,
}) => {
  const numColumns = photos.length === 1 ? 1 : 2;

  return (
    <GlassContainer insideContainerClasses={"py-0 px-0 mb-7"}>
      <View className="p-4 rounded-xl">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row gap-4 items-center">
            <Image
              source={avatar}
              resizeMethod="contain"
              className="bg-[#BCC2C3] w-[45px] h-[45px] rounded-full"
            />
            <View>
              <Text className="text-[13px] font-mmedium text-white">
                {artistName}
              </Text>
              <Text className="text-[#81999E] font-mregular text-[11px]">
                {cryptoAddress}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-1">
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
            <View className="bg-[#BCC2C3] w-[4px] h-[5px] rounded-full" />
          </View>
        </View>
        <View className="mb-4">
          <Text className="text-[13px] text-white font-mregular">
            {content}
          </Text>
        </View>
        <View style={styles.photosContainer(numColumns)}>
          {photos.map((item, index) => (
            <Image
              key={index}
              source={item}
              style={styles.photo(numColumns)}
              resizeMethod="contain"
            />
          ))}
        </View>
        <View className="flex-row w-full items-center justify-between">
          <View className="flex-row w-2/4 items-start justify-start gap-5">
            <View className="flex-row items-center">
              <EvilIcons name="comment" size={30} color="#fff" />
              <Text className="text-[#fff] font-mregular text-[15px]">
                {comments}
              </Text>
            </View>
            <View className="flex-row items-center">
              <EvilIcons name="like" size={30} color="#fff" />
              <Text className="text-[#fff] font-mregular text-[15px]">
                {likes}
              </Text>
            </View>
          </View>
          <Text className="text-[#81999E] font-mregular text-[11px]">
            {timeStamp}
          </Text>
        </View>
      </View>
    </GlassContainer>
  );
};

const styles = StyleSheet.create({
  photosContainer: (numColumns) => ({
    width: "100%",
    flexDirection: numColumns === 1 ? "column" : "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  }),
  photo: (numColumns) => ({
    width: numColumns === 1 ? "100%" : (screenWidth - 64) / 2,
    height: 204,
    borderRadius: 12,
    marginBottom: 16,
  }),
});

export default GenericPostCard;

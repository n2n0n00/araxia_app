import { Image, Text, View, StyleSheet, Dimensions } from "react-native";
import GlassContainer from "../BackgroundContainers/GlassContainer";
import { EvilIcons } from "@expo/vector-icons";
import { images } from "../../constants";
import TextExtra14 from "../Typography/TextExtra14";

const screenWidth = Dimensions.get("window").width;

const ExperienceCertCard = ({
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

        <View className="p-4">
          <GlassContainer
            insideContainerClasses={"p-3 w-[80vw] relative bg-green-500/30"}
          >
            <Image
              source={images.XPCert}
              resizeMethod="contain"
              className="absolute left-4 top-2"
            />
            <View className="flex-col items-center justify-center">
              <TextExtra14 extraClasses={"mb-2"}>
                Experience Certificate
              </TextExtra14>
              <TextExtra14 extraClasses={"mb-4"}>Experience Name</TextExtra14>
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <TextExtra14>Player Name</TextExtra14>
                <TextExtra14>
                  Friends Made:{" "}
                  <TextExtra14 extraClasses={"text-red-500"}>10</TextExtra14>
                </TextExtra14>
                <TextExtra14>
                  NFTs Captured:{" "}
                  <TextExtra14 extraClasses={"text-red-500"}>10/10</TextExtra14>
                </TextExtra14>
              </View>
              <View>
                <TextExtra14>Artist Name</TextExtra14>
                <TextExtra14>London</TextExtra14>
                <TextExtra14>24/06/24</TextExtra14>
              </View>
            </View>
          </GlassContainer>
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

export default ExperienceCertCard;

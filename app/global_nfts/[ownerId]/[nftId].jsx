import { router, useLocalSearchParams } from "expo-router";
import {
  addUserLike,
  checkUserLike,
  getIndividualNFTData,
  globalNFTPageListener,
  removeUserLike,
  updateFavoriteCount,
} from "../../../api/supabase_api";
import { useAuth } from "../../../context/AuthProvider";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";

import { AntDesign, Feather } from "@expo/vector-icons";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import TextBold25 from "../../../components/Typography/TextBold25";
import TextMedium18 from "../../../components/Typography/TextMedium18";
import TextRegular18 from "../../../components/Typography/TextRegular18";
import BuyNFTButton from "../../../components/Buttons/BuyNFTButton";
import TextBold15 from "../../../components/Typography/TextBold15";
import { icons, images } from "../../../constants";
import GenericFullScreenLoader from "../../../components/Loaders/GenericFullScreenLoader";

const GenericNFTScreen = () => {
  globalNFTPageListener();
  const { authUser } = useAuth();
  const { ownerId, nftId } = useLocalSearchParams();

  const [NFT, setNFT] = useState(null);
  const [creator, setCreator] = useState(null);
  const [owner, setOwner] = useState(null);
  const [maximizeImage, setMaximizeImage] = useState(false);
  const [likeNFT, setLikeNFT] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleMaximizeImage = () => {
    setMaximizeImage(!maximizeImage);
  };

  const handleUserProfileRoute = (ownerId) => {
    router.push(`/user/${ownerId}`);
  };

  const handleLikedNFT = async () => {
    if (!likeNFT) {
      const likesCounter = NFT.favorite_count + 1;
      setLikeNFT(true);
      setNFT({ ...NFT, favorite_count: likesCounter });
      await updateFavoriteCount(nftId, likesCounter);
      await addUserLike(ownerId, nftId);
    }
  };

  const handleUnlikedNFT = async () => {
    if (likeNFT) {
      const likesCounter = NFT.favorite_count - 1;
      setLikeNFT(false);
      setNFT({ ...NFT, favorite_count: likesCounter });
      await updateFavoriteCount(nftId, likesCounter);
      await removeUserLike(ownerId, nftId);
    }
  };

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const { nft, creator, owner } = await getIndividualNFTData(nftId);
        setNFT(nft);
        setCreator(creator);
        setOwner(owner);

        const userLiked = await checkUserLike(ownerId, nftId);
        setLikeNFT(userLiked);
      } catch (error) {
        console.error("Error fetching NFT and related data:", error.message);
      }
    };
    fetchNFT();
  }, [nftId, ownerId]);

  if (!NFT || !owner || !creator) {
    return <GenericFullScreenLoader />;
  }

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <View className="mt-8 w-screen p-4 flex-row items-center justify-between absolute left-0 top-0 z-50">
          <TouchableOpacity onPress={handleBack}>
            <Image source={icons.backArrow} resizeMethod="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleMaximizeImage}
            className="h-[40px] w-[40px] rounded-3xl bg-purple-900 items-center justify-center"
          >
            <Feather name="maximize" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <BgBlackOverlay>
          <Image
            className="h-[60vh] w-screen rounded-b-[50px]"
            resizeMode="cover"
            source={{ uri: NFT.image_url }}
          />

          {maximizeImage ? (
            <TouchableOpacity
              className="h-screen w-screen absolute z-50 items-center justify-center"
              onPress={handleMaximizeImage}
            >
              <View className="bg-black opacity-80 h-full w-full absolute" />
              <View className="w-screen h-screen items-center justify-center">
                <Image
                  source={{ uri: NFT.image_url }}
                  resizeMode="contain"
                  className="w-full h-full"
                />
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}

          <ScrollView>
            <View className="flex-col items-center w-screen h-full p-4">
              <View className="w-full flex-row items-center justify-between">
                <View>
                  <TextBold25>{NFT.name}</TextBold25>
                  <TextMedium18>
                    Asking Price:{" "}
                    <Text className="text-purple-500 font-mbold">
                      {NFT.price} {NFT.currency}
                    </Text>
                  </TextMedium18>
                </View>
                {likeNFT ? (
                  <TouchableOpacity
                    onPress={handleUnlikedNFT}
                    className="flex-row items-center"
                  >
                    <AntDesign name="heart" size={24} color="white" />
                    <TextMedium18 extraClasses={"pl-2"}>
                      {NFT.favorite_count}
                    </TextMedium18>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleLikedNFT}
                    className="flex-row items-center"
                  >
                    <AntDesign name="hearto" size={24} color="white" />
                    <TextMedium18 extraClasses={"pl-2"}>
                      {NFT.favorite_count}
                    </TextMedium18>
                  </TouchableOpacity>
                )}
              </View>

              <TextRegular18 extraClasses={"mt-10 mb-5"}>
                {NFT.description}
              </TextRegular18>
              <View>
                <BuyNFTButton price={`${NFT.price} ${NFT.currency}`} />
              </View>
              <View className="flex-row w-full items-start justify-between my-10">
                <View>
                  <TextMedium18>Artist</TextMedium18>
                  <TouchableOpacity
                    onPress={() => handleUserProfileRoute(creator.userId)}
                    className="flex-row items-center mt-2"
                  >
                    <Image
                      resizeMode="cover"
                      className="w-[40px] h-[40px] rounded-full mr-2"
                      source={{ uri: creator.avatar }}
                    />
                    <TextBold15>{creator.username}</TextBold15>
                  </TouchableOpacity>
                </View>
                <View>
                  <TextMedium18>Collector</TextMedium18>
                  <TouchableOpacity
                    onPress={() => handleUserProfileRoute(owner.userId)}
                    className="flex-row items-center mt-2"
                  >
                    <Image
                      resizeMode="cover"
                      className="w-[40px] h-[40px] rounded-full mr-2"
                      source={{ uri: owner.avatar }}
                    />

                    <TextBold15>{owner.username}</TextBold15>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default GenericNFTScreen;

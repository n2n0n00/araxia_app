import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { icons, images } from "../../../constants";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import TextBold25 from "../../../components/Typography/TextBold25";
import TextMedium18 from "../../../components/Typography/TextMedium18";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextRegular18 from "../../../components/Typography/TextRegular18";
import TextBold15 from "../../../components/Typography/TextBold15";
import BuyNFTButton from "../../../components/Buttons/BuyNFTButton";
import {
  getIndividualNFT,
  getIndividualNFTCreator,
  getIndividualNFTOwner,
} from "../../../api/supabase_api";

const OwnedNFT = () => {
  const { userId, nftId } = useLocalSearchParams();
  const [NFT, setNFT] = useState(null);
  const [creator, setCreator] = useState(null);
  const [owner, setOwner] = useState(null);

  const handleBack = () => {
    router.push("/profile");
  };

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const nftData = await getIndividualNFT(nftId);
        setNFT(nftData);
        const dum = nftData[0].creator_id;
        const dumdum = nftData[0].owner_id;

        const creatorData = await getIndividualNFTCreator(dum);
        setCreator(creatorData);

        const ownerData = await getIndividualNFTOwner(dumdum);
        setOwner(ownerData);
      } catch (error) {
        console.error("Error fetching NFT data: ", error.message);
      }
    };
    fetchNFT();
  }, [nftId]);

  if (!NFT || !creator || !owner) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  console.log(owner);
  console.log(creator);

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
        </View>
        <BgBlackOverlay>
          <View className="bg-white h-[60vh] w-screen rounded-b-[50px]" />
          <ScrollView>
            <View className="flex-col items-center w-screen h-full p-4">
              <View className="w-full flex-row items-center justify-between">
                <View>
                  <TextBold25>{NFT[0]?.name}</TextBold25>
                  <TextMedium18>
                    Asking Price:{" "}
                    <Text className="text-purple-500 font-mbold">
                      {NFT[0]?.price} {NFT[0]?.currency}
                    </Text>
                  </TextMedium18>
                </View>
                <View className="flex-row items-center">
                  <AntDesign name="hearto" size={24} color="white" />
                  <TextMedium18 extraClasses={"pl-2"}>35</TextMedium18>
                </View>
              </View>

              <TextRegular18 extraClasses={"mt-10 mb-5"}>
                Lorem ipsum dolor sit amet consectetur. Placerat nec lacus
                facilisis nulla. Amet vitae vel posuere faucibus eu. Sed arcu
                amet et habitant
              </TextRegular18>
              <View>
                <BuyNFTButton price={"100 ETH"} />
              </View>
              <View className="flex-row w-full items-start justify-between my-10">
                <View>
                  <TextMedium18>Artist</TextMedium18>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-white w-[35px] h-[35px] rounded-full mr-2" />
                    <TextBold15>{creator[0]?.username}</TextBold15>
                  </View>
                </View>
                <View>
                  <TextMedium18>Collector</TextMedium18>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-white w-[35px] h-[35px] rounded-full mr-2" />
                    <TextBold15>{owner[0]?.username}</TextBold15>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default OwnedNFT;

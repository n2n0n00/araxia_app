import { useEffect, useState } from "react";
import {
  addUserLikedExperience,
  checkUserLikedExperience,
  getIndividualExperienceData,
  removeUserLikedExperience,
  updateExperienceFavoriteCount,
} from "../../../api/supabase_api";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import BuyNFTButton from "../../../components/Buttons/BuyNFTButton";
import { useAuth } from "../../../context/AuthProvider";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import GlassContainer from "../../../components/BackgroundContainers/GlassContainer";
import GlowLetters from "../../../components/Typography/GlowLetters";
import TextMedium18 from "../../../components/Typography/TextMedium18";
import TextMedium14 from "../../../components/Typography/TextMedium14";
import TextSemi18 from "../../../components/Typography/TextSemi18";
import TextRegular16 from "../../../components/Typography/TextRegular16";
import TextBold18 from "../../../components/Typography/TextBold18";
import { AntDesign } from "@expo/vector-icons";
import { icons, images } from "../../../constants";

const BuyExperiencePageSearch = () => {
  const { authUser } = useAuth();
  const { artistId, experienceId } = useLocalSearchParams();
  const [experience, setExperience] = useState(null);
  const [creator, setCreator] = useState(null);
  const [likeExperience, setLikeExperience] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleUserProfileRoute = (ownerId) => {
    router.push(`/user/${ownerId}`);
  };

  const handleLikedExperience = async () => {
    if (!likeExperience) {
      const likesCounter = experience.favorite_count + 1;
      setLikeExperience(true);
      setExperience({ ...experience, favorite_count: likesCounter });
      await updateExperienceFavoriteCount(experienceId, likesCounter);
      await addUserLikedExperience(authUser.userId, experienceId);
    }
  };

  const handleUnlikedExperience = async () => {
    if (likeExperience) {
      const likesCounter = experience.favorite_count - 1;
      setLikeExperience(false);
      setExperience({ ...experience, favorite_count: likesCounter });
      await updateExperienceFavoriteCount(experienceId, likesCounter);
      await removeUserLikedExperience(authUser.userId, experienceId);
    }
  };

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const { experience, creator } = await getIndividualExperienceData(
          experienceId
        );
        setExperience(experience);
        setCreator(creator);

        const userLiked = await checkUserLikedExperience(
          artistId,
          experienceId
        );
        setLikeExperience(userLiked);
      } catch (error) {
        console.error(
          "Error fetching experience and related data:",
          error.message
        );
      }
    };
    fetchNFT();
  }, [artistId, experienceId]);

  if (!experience || !creator) {
    // Show loader while data is being fetched
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#C796FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <View className="mt-8 w-screen p-4 flex-row items-center justify-start absolute left-0 top-0 z-50">
          <TouchableOpacity onPress={handleBack}>
            <Image source={icons.backArrow} resizeMethod="contain" />
          </TouchableOpacity>
        </View>
        <BgBlackOverlay>
          <Image
            className="h-[60vh] w-screen rounded-b-[50px]"
            resizeMode="cover"
            source={{
              uri: experience.experience_banner,
            }}
          />
          <ScrollView>
            <View className="flex-col items-center w-screen h-full p-4">
              <View className="w-full flex-col items-start justify-between">
                <View className="mt-5 flex-row w-full justify-between">
                  <GlowLetters>{experience.experience_name}</GlowLetters>

                  {likeExperience ? (
                    <TouchableOpacity
                      onPress={handleUnlikedExperience}
                      className="flex-row items-center"
                    >
                      <AntDesign name="heart" size={24} color="white" />
                      <TextMedium18 extraClasses={"pl-2"}>
                        {experience.favorite_count}
                      </TextMedium18>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={handleLikedExperience}
                      className="flex-row items-center"
                    >
                      <AntDesign name="hearto" size={24} color="white" />
                      <TextMedium18 extraClasses={"pl-2"}>
                        {experience.favorite_count}
                      </TextMedium18>
                    </TouchableOpacity>
                  )}
                </View>
                <View className="flex-row mt-1">
                  <Image
                    className="h-[40px] w-[40px] rounded-full mr-4"
                    resizeMode="cover"
                    source={{
                      uri: creator.avatar,
                    }}
                  />
                  <View>
                    <TextMedium14>Artist</TextMedium14>
                    <TextSemi18>{creator.artistName}</TextSemi18>
                  </View>
                </View>
              </View>

              <TextRegular16 extraClasses={"mt-10"}>
                {experience.experience_description}
              </TextRegular16>

              <View>
                <BuyNFTButton
                  price={`${experience.experience_price} ${experience.experience_currency}`}
                />
              </View>

              <GlassContainer
                extraClasses="w-full items-start justify-between mt-8"
                insideContainerClasses={"p-4"}
              >
                <TextBold18 extraClasses={"pb-5 text-2xl"}>
                  Experience Stats
                </TextBold18>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Total NFTs To Capture:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {experience.experience_nfts}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Total XP:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {experience.experience_points}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Experience Type:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {experience.experience_type}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"mr-4 text-left text-lg"}>
                  Location:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {experience.experience_city}
                    {", "}
                    {experience.experience_country}
                  </Text>
                </TextMedium14>
                <TextMedium14 extraClasses={"text-left text-lg"}>
                  Running Time:{" "}
                  <Text className="text-purple-400 font-mbold">
                    {experience.running_time}
                  </Text>
                </TextMedium14>
              </GlassContainer>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default BuyExperiencePageSearch;

// import { router, useLocalSearchParams } from "expo-router";
// import {
//   addUserLike,
//   checkUserLike,
//   getIndividualNFTData,
//   globalNFTPageListener,
//   removeUserLike,
//   updateFavoriteCount,
// } from "../../../api/supabase_api";
// import { useAuth } from "../../../context/AuthProvider";
// import { useEffect, useState } from "react";
// import {
//   Image,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";

// import { AntDesign, Feather } from "@expo/vector-icons";
// import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
// import TextBold25 from "../../../components/Typography/TextBold25";
// import TextMedium18 from "../../../components/Typography/TextMedium18";
// import TextRegular18 from "../../../components/Typography/TextRegular18";
// import BuyNFTButton from "../../../components/Buttons/BuyNFTButton";
// import TextBold15 from "../../../components/Typography/TextBold15";
// import { icons, images } from "../../../constants";

// const GenericExperienceCard = () => {
//   globalNFTPageListener();
//   const { authUser } = useAuth();
//   const { ownerId, nftId } = useLocalSearchParams();

//   const [NFT, setNFT] = useState(null);
//   const [creator, setCreator] = useState(null);
//   const [owner, setOwner] = useState(null);
//   const [maximizeImage, setMaximizeImage] = useState(false);
//   const [likeNFT, setLikeNFT] = useState(false);

//   const handleBack = () => {
//     router.back();
//   };

//   const handleMaximizeImage = () => {
//     setMaximizeImage(!maximizeImage);
//   };

//   const handleUserProfileRoute = (ownerId) => {
//     router.push(`/user/${ownerId}`);
//   };

//   const handleLikedNFT = async () => {
//     if (!likeNFT) {
//       const likesCounter = NFT.favorite_count + 1;
//       setLikeNFT(true);
//       setNFT({ ...NFT, favorite_count: likesCounter });
//       await updateFavoriteCount(nftId, likesCounter);
//       await addUserLike(ownerId, nftId);
//     }
//   };

//   const handleUnlikedNFT = async () => {
//     if (likeNFT) {
//       const likesCounter = NFT.favorite_count - 1;
//       setLikeNFT(false);
//       setNFT({ ...NFT, favorite_count: likesCounter });
//       await updateFavoriteCount(nftId, likesCounter);
//       await removeUserLike(ownerId, nftId);
//     }
//   };

//   useEffect(() => {
//     const fetchNFT = async () => {
//       try {
//         const { nft, creator, owner } = await getIndividualNFTData(nftId);
//         setNFT(nft);
//         setCreator(creator);
//         setOwner(owner);

//         const userLiked = await checkUserLike(ownerId, nftId);
//         setLikeNFT(userLiked);
//       } catch (error) {
//         console.error("Error fetching NFT and related data:", error.message);
//       }
//     };
//     fetchNFT();
//   }, [nftId, ownerId]);

//   if (!NFT || !owner || !creator) {
//     return (
//       <SafeAreaView className="flex-1 items-center justify-center">
//         <Text>Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1">
//       <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
//         <Image
//           source={images.loginBG}
//           resizeMode="contain"
//           className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
//         />
//         <View className="mt-8 w-screen p-4 flex-row items-center justify-between absolute left-0 top-0 z-50">
//           <TouchableOpacity onPress={handleBack}>
//             <Image source={icons.backArrow} resizeMethod="contain" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={handleMaximizeImage}
//             className="h-[40px] w-[40px] rounded-3xl bg-purple-900 items-center justify-center"
//           >
//             <Feather name="maximize" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//         <BgBlackOverlay>
//           <Image
//             className="h-[60vh] w-screen rounded-b-[50px]"
//             resizeMode="cover"
//             source={{ uri: NFT.image_url }}
//           />

//           {maximizeImage ? (
//             <TouchableOpacity
//               className="h-screen w-screen absolute z-50 items-center justify-center"
//               onPress={handleMaximizeImage}
//             >
//               <View className="bg-black opacity-80 h-full w-full absolute" />
//               <View className="w-screen h-screen items-center justify-center">
//                 <Image
//                   source={{ uri: NFT.image_url }}
//                   resizeMode="contain"
//                   className="w-full h-full"
//                 />
//               </View>
//             </TouchableOpacity>
//           ) : (
//             <></>
//           )}

//           <ScrollView>
//             <View className="flex-col items-center w-screen h-full p-4">
//               <View className="w-full flex-row items-center justify-between">
//                 <View>
//                   <TextBold25>{NFT.name}</TextBold25>
//                   <TextMedium18>
//                     Asking Price:{" "}
//                     <Text className="text-purple-500 font-mbold">
//                       {NFT.price} {NFT.currency}
//                     </Text>
//                   </TextMedium18>
//                 </View>
//                 {likeNFT ? (
//                   <TouchableOpacity
//                     onPress={handleUnlikedNFT}
//                     className="flex-row items-center"
//                   >
//                     <AntDesign name="heart" size={24} color="white" />
//                     <TextMedium18 extraClasses={"pl-2"}>
//                       {NFT.favorite_count}
//                     </TextMedium18>
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity
//                     onPress={handleLikedNFT}
//                     className="flex-row items-center"
//                   >
//                     <AntDesign name="hearto" size={24} color="white" />
//                     <TextMedium18 extraClasses={"pl-2"}>
//                       {NFT.favorite_count}
//                     </TextMedium18>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <TextRegular18 extraClasses={"mt-10 mb-5"}>
//                 {NFT.description}
//               </TextRegular18>
//               <View>
//                 <BuyNFTButton price={`${NFT.price} ${NFT.currency}`} />
//               </View>
//               <View className="flex-row w-full items-start justify-between my-10">
//                 <View>
//                   <TextMedium18>Artist</TextMedium18>
//                   <TouchableOpacity
//                     onPress={() => handleUserProfileRoute(creator.userId)}
//                     className="flex-row items-center mt-2"
//                   >
//                     <Image
//                       resizeMode="cover"
//                       className="w-[40px] h-[40px] rounded-full mr-2"
//                       source={{ uri: creator.avatar }}
//                     />
//                     <TextBold15>{creator.username}</TextBold15>
//                   </TouchableOpacity>
//                 </View>
//                 <View>
//                   <TextMedium18>Collector</TextMedium18>
//                   <TouchableOpacity
//                     onPress={() => handleUserProfileRoute(owner.userId)}
//                     className="flex-row items-center mt-2"
//                   >
//                     <Image
//                       resizeMode="cover"
//                       className="w-[40px] h-[40px] rounded-full mr-2"
//                       source={{ uri: owner.avatar }}
//                     />

//                     <TextBold15>{owner.username}</TextBold15>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </ScrollView>
//         </BgBlackOverlay>
//       </BgDarkGradient>
//     </SafeAreaView>
//   );
// };

// export default GenericExperienceCard;

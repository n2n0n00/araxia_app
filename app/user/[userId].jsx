import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import addressShortener from "../../utils/addressShortener";
import { getUserNFTs, globalNFTsListener } from "../../api/supabase_api";
import { FlatList, Image, SafeAreaView, View } from "react-native";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import Header from "../../components/ProfileComponents/Header";
import FandomCard from "../../components/ProfileComponents/FandomCard";
import TabsInterface from "../../components/TabsInterface/TabsInterface";
import NFTsList from "../../components/ProfileComponents/NFTsList";
import ExperiencesPosts from "../../components/ProfileComponents/ExperiencesPosts";
import { images } from "../../constants";

const UserProfilePage = () => {
  const { userId } = useLocalSearchParams();
  const [userData, setUserData] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);

  const userstuff = async () => {
    const { data: ownerData, error: ownerError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", userId);
    console.log(ownerData);
    setUserData(ownerData);
  };
  useEffect(() => {
    userstuff;
  }, [userId]);

  //const cryptoAddressShort = addressShortener(userData?.cryptoAddress);

  useEffect(() => {
    const fetchNFTs = async () => {
      globalNFTsListener(setUserNFTs, userId);

      const nfts = await getUserNFTs(userId);
      setUserNFTs(nfts);
    };

    fetchNFTs();
  }, [userId]);

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop="-mt-5">
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <BgBlackOverlay>
          <FlatList
            ListHeaderComponent={
              <>
                <AraxiaHeadBar />
                <View className="flex-col items-center w-full p-4 h-[450px]">
                  {/* <Header
                    totalNfts={userData.nfts}
                    levelXP={userData.levelXP}
                    followers={userData.followers.length}
                    following={userData.following.length}
                    cryptoAddress={userData.cryptoAddress}
                    username={userData.username}
                    bio={userData.bio}
                    userId={userData.userId}
                    avatar={userData.avatar}
                  />
                  <FandomCard currentFandom={userData.currentFandom} /> */}
                </View>
              </>
            }
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={null}
            ListFooterComponent={
              <View className="items-center justify-center flex-1 w-full p-4 mt-10 h-full">
                {/* <TabsInterface
                  tabLeft="nfts"
                  tabRight="experiences"
                  tabLeftComponent={
                    <NFTsList userNFTs={userNFTs} userId={userData.userId} />
                  }
                  tabRightComponent={<ExperiencesPosts />}
                  tabLeftLabel="NFTs"
                  tabRightLabel="Experiences"
                /> */}
              </View>
            }
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default UserProfilePage;

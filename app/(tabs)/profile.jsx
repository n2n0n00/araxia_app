import {
  View,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import TabsInterface from "../../components/TabsInterface/TabsInterface";
import Header from "../../components/ProfileComponents/Header";
import NFTsList from "../../components/ProfileComponents/NFTsList";
import ExperiencesPosts from "../../components/ProfileComponents/ExperiencesPosts";
import FandomCard from "../../components/ProfileComponents/FandomCard";
import { useAuth } from "../../context/AuthProvider";
import { addressShortener } from "../../utils/addressShortener";

const Profile = () => {
  const { authUser } = useAuth();
  // const [refreshing, setRefreshing] = useState(false);

  const cryptoAddressShort = addressShortener(authUser.cryptoAddress);

  // const onRefresh = async () => {
  //   // setRefreshing(true);
  //   // Add your refetch logic here
  //   // setRefreshing(false);
  // };

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
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
                  <Header
                    totalNfts={authUser.nfts}
                    levelXP={authUser.levelXP}
                    followers={authUser.followers.length}
                    following={authUser.following.length}
                    cryptoAddress={cryptoAddressShort}
                    username={authUser.username}
                    bio={authUser.bio}
                    userId={authUser.userId}
                    avatar={authUser.avatar}
                  />
                  <FandomCard currentFandom={authUser.currentFandom} />
                </View>
              </>
            }
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={null}
            ListFooterComponent={
              <View className="items-center justify-center flex-1 w-full p-4 mt-10 h-full">
                <TabsInterface
                  tabLeft={"nfts"}
                  tabRight={"experiences"}
                  tabLeftComponent={<NFTsList />}
                  tabRightComponent={<ExperiencesPosts />}
                  tabLeftLabel={"NFTs"}
                  tabRightLabel={"Experiences"}
                />
              </View>
            }
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Profile;

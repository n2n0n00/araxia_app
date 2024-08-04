import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { addressShortener } from "../../utils/addressShortener";
import {
  fetchUserDetails,
  getUserNFTs,
  getFollowingUsers,
  getFollowedUsers,
  globalNFTsListener,
} from "../../api/supabase_api";
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
import { useAuth } from "../../context/AuthProvider";
import { numberFormatter } from "../../utils/numberFormatter";

const ArtistId = () => {
  const { authUser } = useAuth();
  const { artistId } = useLocalSearchParams();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userData, setUserData] = useState({});
  const [userNFTs, setUserNFTs] = useState([]);
  const [userCryptoAddress, setUserCryptoAddress] = useState();

  useEffect(() => {
    const userDetails = async () => {
      try {
        const artist = await fetchUserDetails(artistId);
        setUserData(artist[0]);
        setUserCryptoAddress(addressShortener(await artist[0]?.cryptoAddress));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserExtendedData = async () => {
      try {
        globalNFTsListener(setUserNFTs, artistId);

        const [nfts, followingList, followersList] = await Promise.all([
          getUserNFTs(artistId),
          getFollowingUsers(artistId),
          getFollowedUsers(artistId),
        ]);

        setUserNFTs(nfts);
        setFollowers(followingList);
        setFollowing(followersList);
      } catch (error) {
        console.error("Error in fetchUserExtendedData:", error.message);
      }
    };

    if (artistId) {
      userDetails();
      fetchUserExtendedData();
    }
  }, [artistId]);

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
                <AraxiaHeadBar nonTabPage />
                <View className="flex-col items-center w-full p-4 h-[450px]">
                  {userData && (
                    <>
                      <Header
                        isUserArtist={userData.isUserArtist}
                        artistId={userData.userId}
                        currentUser={authUser.userId}
                        totalNfts={userData.nfts}
                        levelXP={userData.levelXP}
                        followers={
                          followers.length
                            ? numberFormatter(followers.length)
                            : 0
                        }
                        following={
                          following.length
                            ? numberFormatter(following.length)
                            : 0
                        }
                        cryptoAddress={userCryptoAddress}
                        username={userData.username}
                        bio={userData.bio}
                        userId={userData.userId}
                        avatar={userData.avatar}
                      />
                      <FandomCard currentFandom={userData.currentFandom} />
                    </>
                  )}
                </View>
              </>
            }
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={null}
            ListFooterComponent={
              <View className="items-center justify-center flex-1 w-full p-4 mt-10 h-full">
                {userData && (
                  <TabsInterface
                    tabLeft="nfts"
                    tabRight="experiences"
                    tabLeftComponent={
                      <NFTsList userNFTs={userNFTs} userId={userData.userId} />
                    }
                    tabRightComponent={<ExperiencesPosts />}
                    tabLeftLabel="NFTs"
                    tabRightLabel="Experiences"
                  />
                )}
              </View>
            }
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default ArtistId;

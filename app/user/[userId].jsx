import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { addressShortener } from "../../utils/addressShortener";
import {
  fetchUserDetails,
  getFollowedUsers,
  getFollowingUsers,
  getUserNFTs,
  getUserPosts,
  getUserSubscribedExperiencesData,
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
import GenericFullScreenLoader from "../../components/Loaders/GenericFullScreenLoader";
import FollowButton from "../../components/Buttons/FollowButton";
import PostsList from "../../components/ProfileComponents/PostsList";

const UserProfilePage = () => {
  const { authUser } = useAuth();
  const { userId } = useLocalSearchParams();
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userData, setUserData] = useState({});
  const [userNFTs, setUserNFTs] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userExperiences, setUserExperiences] = useState([]);
  const [userCryptoAddress, setUserCryptoAddress] = useState();
  const [userDetailsLoader, setUserDetailsLoader] = useState(false);
  const [userExtendedDataLoader, setUserExtendedDataLoader] = useState(false);

  useEffect(() => {
    const userDetails = async () => {
      try {
        setUserDetailsLoader(true);
        const artist = await fetchUserDetails(userId);
        setUserData(artist[0]);
        setUserCryptoAddress(addressShortener(await artist[0]?.cryptoAddress));
      } catch (error) {
        console.error(error);
      } finally {
        setUserDetailsLoader(false);
      }
    };

    const fetchUserExtendedData = async () => {
      try {
        globalNFTsListener(setUserNFTs, userId);

        setUserExtendedDataLoader(true);
        const [
          nfts,
          followingList,
          followersList,
          fetchUserPosts,
          fetchUserExperiences,
        ] = await Promise.all([
          getUserNFTs(userId),
          getFollowingUsers(userId),
          getFollowedUsers(userId),
          getUserPosts(userId),
          getUserSubscribedExperiencesData(userId),
        ]);
        setUserPosts(fetchUserPosts);
        setUserExperiences(fetchUserExperiences);
        setUserNFTs(nfts);
        setFollowers(followingList);
        setFollowing(followersList);
      } catch (error) {
        console.error("Error in fetchUserExtendedData:", error.message);
      } finally {
        setUserExtendedDataLoader(false);
      }
    };

    if (userId) {
      userDetails();
      fetchUserExtendedData();
    }
  }, [userId]);

  if (
    (userDetailsLoader && userExtendedDataLoader) ||
    (!userDetailsLoader && userExtendedDataLoader) ||
    (userDetailsLoader && !userExtendedDataLoader)
  ) {
    return <GenericFullScreenLoader />;
  }

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
                      <View className="w-full items-end justify-end">
                        <FollowButton
                          userId={authUser.userId}
                          followedUserId={userId}
                        />
                      </View>

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
                        longCryptoAddress={userData.cryptoAddress}
                        username={userData.username}
                        bio={userData.bio}
                        userId={userData.userId}
                        avatar={userData.avatar}
                      />

                      <FandomCard
                        isUserArtist={userData.isUserArtist}
                        currentFandom={userData.currentFandom}
                      />
                    </>
                  )}
                </View>
              </>
            }
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={null}
            ListFooterComponent={
              <View
                className={`items-center justify-center flex-1 w-full p-4 mt-20 h-full`}
              >
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
                    tabCenter="posts"
                    tabCenterLabel="Posts"
                    tabCenterComponent={
                      <PostsList userPosts={userPosts} userData={userData} />
                    }
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

export default UserProfilePage;

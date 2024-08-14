import { View, FlatList, Image, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
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
import {
  getFollowedUsers,
  getFollowingUsers,
  getUserNFTs,
  getUserPosts,
  getUserSubscribedExperiencesData,
  globalNFTsListener,
} from "../../api/supabase_api";
import { numberFormatter } from "../../utils/numberFormatter";
import GenericFullScreenLoader from "../../components/Loaders/GenericFullScreenLoader";
import PostsList from "../../components/ProfileComponents/PostsList";

const Profile = () => {
  const { authUser } = useAuth();

  // const cryptoAddressShort = addressShortener(authUser?.cryptoAddress);

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userExperiences, setUserExperiences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        globalNFTsListener(setUserNFTs, authUser?.userId);

        setLoading(true);
        const [
          nfts,
          followingUsers,
          followedUsers,
          fetchUserPosts,
          fetchUserExperiences,
        ] = await Promise.all([
          getUserNFTs(authUser.userId),
          getFollowingUsers(authUser.userId),
          getFollowedUsers(authUser.userId),
          getUserPosts(authUser.userId),
          getUserSubscribedExperiencesData(authUser.userId),
        ]);

        console.log(userPosts);
        setUserPosts(fetchUserPosts);
        setUserExperiences(fetchUserExperiences);
        setUserNFTs(nfts);
        setFollowing(followingUsers);
        setFollowers(followedUsers);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchData();
    }
  }, []);

  if (loading) {
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
                <AraxiaHeadBar />
                <View className="flex-col items-center w-full p-4 h-[450px]">
                  <Header
                    currentUser={authUser?.userId}
                    totalNfts={authUser.nfts}
                    levelXP={authUser.levelXP}
                    longCryptoAddress={authUser?.cryptoAddress}
                    followers={
                      followers.length ? numberFormatter(followers.length) : 0
                    }
                    following={
                      following.length ? numberFormatter(following.length) : 0
                    }
                    // cryptoAddress={cryptoAddressShort}
                    username={authUser.username}
                    bio={authUser.bio}
                    userId={authUser.userId}
                    avatar={authUser.avatar}
                  />
                  <FandomCard
                    isUserArtist={authUser.isUserArtist}
                    currentFandom={authUser.currentFandom}
                  />
                </View>
              </>
            }
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={null}
            ListFooterComponent={
              <View className="items-center justify-center flex-1 w-full p-4 mt-10 h-full">
                <TabsInterface
                  tabLeft="nfts"
                  tabCenter="posts"
                  tabRight="experiences"
                  tabLeftComponent={
                    <NFTsList userNFTs={userNFTs} userId={authUser.userId} />
                  }
                  tabCenterComponent={
                    <PostsList userPosts={userPosts} userData={authUser} />
                  }
                  tabRightComponent={
                    <ExperiencesPosts
                      experiences={userExperiences}
                      authUser={authUser}
                    />
                  }
                  tabLeftLabel="NFTs"
                  tabCenterLabel="Posts"
                  tabRightLabel="Experiences"
                />
              </View>
            }
          />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Profile;

// import { View, FlatList, Image, SafeAreaView } from "react-native";
// import React, { useState, useEffect } from "react";
// import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
// import { images } from "../../constants";
// import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
// import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
// import TabsInterface from "../../components/TabsInterface/TabsInterface";
// import Header from "../../components/ProfileComponents/Header";
// import NFTsList from "../../components/ProfileComponents/NFTsList";
// import ExperiencesPosts from "../../components/ProfileComponents/ExperiencesPosts";
// import FandomCard from "../../components/ProfileComponents/FandomCard";
// import { useAuth } from "../../context/AuthProvider";
// import { addressShortener } from "../../utils/addressShortener";
// import {
//   getFollowedUsers,
//   getFollowingUsers,
//   getUserNFTs,
//   getUserSubscribedExperiencesData,
//   globalNFTsListener,
// } from "../../api/supabase_api";
// import { numberFormatter } from "../../utils/numberFormatter";
// import GenericFullScreenLoader from "../../components/Loaders/GenericFullScreenLoader";

// const Profile = () => {
//   const { authUser } = useAuth();

//   const cryptoAddressShort = addressShortener(authUser?.cryptoAddress);

//   const [following, setFollowing] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [userNFTs, setUserNFTs] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [userExperiences, setUserExperiences] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         globalNFTsListener(setUserNFTs, authUser?.userId);

//         setLoading(true);
//         const [nfts, following, followers] = await Promise.all([
//           getUserNFTs(authUser.userId),
//           getFollowingUsers(authUser.userId),
//           getFollowedUsers(authUser.userId),
//         ]);

//         const userExperiencesData = await getUserSubscribedExperiencesData(
//           authUser.userId
//         );

//         setUserExperiences(userExperiencesData);
//         setUserNFTs(nfts);
//         setFollowing(followers);
//         setFollowers(following);
//       } catch (error) {
//         console.error("Error fetching data:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (authUser) {
//       fetchData();
//     }
//   }, []);

//   if (loading) {
//     return <GenericFullScreenLoader />;
//   }

//   return (
//     <SafeAreaView className="flex-1">
//       <BgDarkGradient linearGradientMarginTop="-mt-5">
//         <Image
//           source={images.loginBG}
//           resizeMode="contain"
//           className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
//         />
//         <BgBlackOverlay>
//           <FlatList
//             ListHeaderComponent={
//               <>
//                 <AraxiaHeadBar />
//                 <View className="flex-col items-center w-full p-4 h-[450px]">
//                   <Header
//                     currentUser={authUser.userId}
//                     totalNfts={authUser.nfts}
//                     levelXP={authUser.levelXP}
//                     longCryptoAddress={authUser?.cryptoAddress}
//                     followers={
//                       followers.length ? numberFormatter(followers.length) : 0
//                     }
//                     following={
//                       following.length ? numberFormatter(following.length) : 0
//                     }
//                     cryptoAddress={cryptoAddressShort}
//                     username={authUser.username}
//                     bio={authUser.bio}
//                     userId={authUser.userId}
//                     avatar={authUser.avatar}
//                   />
//                   <FandomCard
//                     isUserArtist={authUser.isUserArtist}
//                     currentFandom={authUser.currentFandom}
//                   />
//                 </View>
//               </>
//             }
//             data={[]}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={null}
//             ListFooterComponent={
//               <View className="items-center justify-center flex-1 w-full p-4 mt-10 h-full">
//                 <TabsInterface
//                   tabLeft="nfts"
//                   tabRight="experiences"
//                   tabLeftComponent={
//                     <NFTsList userNFTs={userNFTs} userId={authUser.userId} />
//                   }
//                   tabRightComponent={
//                     <ExperiencesPosts
//                       experiences={userExperiences}
//                       authUser={authUser}
//                     />
//                   }
//                   tabLeftLabel="NFTs"
//                   tabRightLabel="Experiences"
//                 />
//               </View>
//             }
//           />
//         </BgBlackOverlay>
//       </BgDarkGradient>
//     </SafeAreaView>
//   );
// };

// export default Profile;

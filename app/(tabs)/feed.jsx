import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import { images } from "../../constants";
import AraxiaHeadBar from "../../components/HeadBars/AraxiaHeadBar";
import UpcomingExpCard from "../../components/Cards/UpcomingExpCard";
import TextSemi20 from "../../components/Typography/TextSemi20";
import BgBlackOverlay from "../../components/BackgroundGradients/BgBlackOverlay";
import TabsInterface from "../../components/TabsInterface/TabsInterface";
import TopNFTs from "../../components/FeedComponents/TopNFTs";
import TopArtists from "../../components/FeedComponents/TopArtists";
import { useAuth } from "../../context/AuthProvider";
import { fetchLikedArtistsData } from "../../api/supabase_api";
import TopUsers from "../../components/3DCanvas/TopUsers";

const Feed = () => {
  const { authUser } = useAuth();
  const [userLikedArtists, setUserLikedArtists] = useState([]);
  const [topNFTs, setTopNFTs] = useState([]);

  const likedArtists = async () => {
    try {
      // const artists = await fetchLikedArtistsData(authUser.userId);
      // setUserLikedArtists(artists);
    } catch (error) {
      // console.error("Error fetching liked artists:", error);
    }
  };

  // const currentTopNFTs = async () => {
  //   try {
  //     const NFTs = await fetchTopNFTs()
  //   } catch (error) {

  //   }
  // }

  //TODO: ADD A LOADER TO WAIT UNTIL ARTISTS ARE FETCHED!!!!

  useEffect(() => {
    if (authUser && authUser.userId) {
      likedArtists();
    }
  }, [authUser]);

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <BgBlackOverlay>
          <AraxiaHeadBar />
          <TopUsers />
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default Feed;

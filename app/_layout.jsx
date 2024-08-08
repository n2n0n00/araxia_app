import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { AuthProvider } from "../context/AuthProvider";

SplashScreen.preventAutoHideAsync(); //prevent splashscreen from auto hiding before loading screens

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
    "Montserrat-Italic": require("../assets/fonts/Montserrat-Italic.ttf"),

    "Orbitron-Black": require("../assets/fonts/Orbitron-Black.ttf"),
    "Orbitron-Bold": require("../assets/fonts/Orbitron-Bold.ttf"),
    "Orbitron-ExtraBold": require("../assets/fonts/Orbitron-ExtraBold.ttf"),
    "Orbitron-Medium": require("../assets/fonts/Orbitron-Medium.ttf"),
    "Orbitron-Regular": require("../assets/fonts/Orbitron-Regular.ttf"),
    "Orbitron-SemiBold": require("../assets/fonts/Orbitron-SemiBold.ttf"),
  });

  //allows to do some action while screen is loading etc

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* //remove ugly expo header */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="notifications/[notifications]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="messages/[messages]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
        <Stack.Screen
          name="edit/[id]/UserProfile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="owned_nfts/[userId]/[nftId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="user/[userId]" options={{ headerShown: false }} />
        <Stack.Screen
          name="artist/[artistId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tickets/[userId]/[experienceId]/[artistId]/[ticketId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="enter_game/[userId]/[artistId]/[experienceId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="view_ticket/[userId]/[artistId]/[experienceId]/[concertTicketId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="past_locations/[userId]/[expLocation]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="experience/[artistId]/[experienceId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="global_nfts/[ownerId]/[nftId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="followers/[userId]/followers"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="following/[userId]/following"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="fandom/[fandomId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="post/[userId]/[postId]"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;

//rnfes

//remove ugly top bar

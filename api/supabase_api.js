import { Alert } from "react-native";
import { supabase } from "./supabase";
import { decode } from "base64-arraybuffer";
import { addressShortener } from "../utils/addressShortener";

//NOTE: Functions for profile editing

//uploading user avatar, used in UserProfile to edit user profile avatar

export const uploadAvatar = async (authUser, form, setUploading) => {
  if (!form.avatar) {
    Alert.alert("Error", "Please select an avatar image first.");
    return null;
  }

  setUploading(true);
  const fileType = form.avatar.split(".").pop();

  const fileName = `${authUser.userId}/avatar.${fileType}`;

  try {
    await supabase.storage
      .from("userAvatar")
      .remove([
        `${authUser.userId}/avatar.png`,
        `${authUser.userId}/avatar.jpeg`,
        `${authUser.userId}/avatar.jpg`,
        `${authUser.userId}/avatar.undefined`,
      ]);

    const { data, error } = await supabase.storage
      .from("userAvatar")
      .upload(fileName, decode(form.base64), {
        contentType: `image/${fileType}`,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("userAvatar")
      .getPublicUrl(fileName);

    return `${urlData.publicUrl}?t=${new Date().getTime()}`;
  } catch (error) {
    Alert.alert("Error", `Avatar upload failed: ${error.message}`);
    return null;
  } finally {
    setUploading(false);
  }
};

// updating the whole user profile data, used in the UserProfile component to allow user to update their profile

export const updateUserProfile = async (authUser, form, avatarUrl) => {
  if (!authUser || !authUser.userId) {
    throw new Error("User authentication is not available");
  }

  const updates = {
    username: form.username,
    bio: form.bio,
    currentFandom: form.fandom,
    avatar: avatarUrl || form.avatar,
  };

  try {
    const { data, error } = await supabase
      .from("userDatabase")
      .update(updates)
      .eq("userId", authUser.userId)
      .single();

    if (error) {
      console.error("Update error:", error);
      throw new Error(`Profile update failed: ${error.message}`);
    }

    if (!data) {
      throw new Error("Profile update failed: No matching user found");
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

//NOTE: Functions for getting profile NFTs:

// getting and updating the user nfts data, used in the Profile component for the TabsInterface Component with listerner function for backend relatime update

export const getUserNFTs = async (userId) => {
  try {
    let { data: globalNFTs, error } = await supabase
      .from("globalNFTs")
      .select("*")
      .eq("owner_id", userId);

    if (error) throw error;

    return globalNFTs;
  } catch (error) {
    console.error("Error fetching NFTs: ", error.message);
    throw error;
  }
};

export const globalNFTsListener = (setUserNFTs, userId) => {
  return supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "globalNFTs" },
      async () => {
        const nfts = await getUserNFTs(userId);
        setUserNFTs(nfts);
      }
    )
    .subscribe();
};

//NOTE: Functions for getting NFT data for the NFT page:

// getting the nft data from the nftid taken from the url for the individual nft card routed from the user's profile

export const getIndividualNFT = async (nftId) => {
  try {
    let { data: nftData, error } = await supabase
      .from("globalNFTs")
      .select("*")
      .eq("id", nftId);

    if (error) throw error;

    return nftData;
  } catch (error) {
    console.error("Error fetching NFTs: ", error.message);
    throw error;
  }
};

export const getIndividualNFTData = async (nftId) => {
  try {
    // Fetch the NFT data
    const { data: nftData, error: nftError } = await supabase
      .from("globalNFTs")
      .select("*")
      .eq("id", nftId);

    if (nftError) {
      console.error("Error fetching NFT data:", nftError.message);
      throw nftError;
    }

    const nft = nftData[0];
    if (!nft) {
      throw new Error("NFT not found");
    }

    const { creator_id, owner_id } = nft;

    // Fetch the creator data
    const { data: creatorData, error: creatorError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", creator_id);

    if (creatorError) {
      console.error("Error fetching creator data:", creatorError.message);
      throw creatorError;
    }

    // Fetch the owner data
    const { data: ownerData, error: ownerError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", owner_id);

    if (ownerError) {
      console.error("Error fetching owner data:", ownerError.message);
      throw ownerError;
    }

    return { nft, creator: creatorData[0], owner: ownerData[0] };
  } catch (error) {
    console.error("Error fetching NFT and related data:", error.message);
    throw error;
  }
};

// NOTE: Updating user likes on NFT page functions:

// update favorite counter on NFT page
export const updateFavoriteCount = async (nftId, newCount) => {
  const { data, error } = await supabase
    .from("globalNFTs")
    .update({ favorite_count: newCount })
    .eq("id", nftId);

  if (error) {
    console.error("Error updating favorite count:", error);
  } else {
    console.log("Favorite count updated:", data);
  }
};

// listen to changes on the NFT page for the likes update
export const globalNFTPageListener = () => {
  return supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "globalNFTs" },
      (payload) => {
        console.log("Change received!", payload);
      }
    )
    .subscribe();
};

// add user like to userLikedNFTs
export const addLike = async (userId, nftId) => {
  const { data, error } = await supabase
    .from("userLikedNFTs")
    .insert([{ user_id: userId, nft_id: nftId }]);

  if (error) {
    console.error("Error adding like:", error);
  } else {
    console.log("Like added:", data);
  }
};

// remove a user like from userLikedNFTs
export const removeLike = async (userId, nftId) => {
  const { data, error } = await supabase
    .from("userLikedNFTs")
    .delete()
    .match({ user_id: userId, nft_id: nftId });

  if (error) {
    console.error("Error removing like:", error);
  } else {
    console.log("Like removed:", data);
  }
};

// fetch a like from userLikedNFTs
export const fetchUserLikes = async (userId) => {
  const { data, error } = await supabase
    .from("userLikedNFTs")
    .select("nft_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user likes:", error);
  } else {
    console.log("User likes:", data);
  }
};

//fetch a user from userLikedNFTs
export const fetchNftLikes = async (nftId) => {
  const { data, error } = await supabase
    .from("userLikedNFTs")
    .select("user_id")
    .eq("nft_id", nftId);

  if (error) {
    console.error("Error fetching NFT likes:", error);
  } else {
    console.log("NFT likes:", data);
  }
};

// check if user has liked the NFT in the userLikedNFTs table
export const checkUserLike = async (userId, nftId) => {
  const { data, error } = await supabase
    .from("userLikedNFTs")
    .select("*")
    .eq("user_id", userId)
    .eq("nft_id", nftId);

  if (error) {
    console.error("Error checking user like:", error);
    return false;
  }
  return data.length > 0;
};

// add user like in the userLikedNFTs table
export const addUserLike = async (userId, nftId) => {
  const { error } = await supabase
    .from("userLikedNFTs")
    .insert([{ user_id: userId, nft_id: nftId }]);
  if (error) {
    console.error("Error adding user like:", error);
  }
};

// remove user like from the userLikedNFTs table
export const removeUserLike = async (userId, nftId) => {
  const { error } = await supabase
    .from("userLikedNFTs")
    .delete()
    .match({ user_id: userId, nft_id: nftId });
  if (error) {
    console.error("Error removing user like:", error);
  }
};

// NOTE: Fetch and Check If a User has liked an artist for the artist's page

export const checkArtistLike = async (userId, artistId) => {
  const { data, error } = await supabase
    .from("userLikedArtists")
    .select("*")
    .eq("user_id", userId)
    .eq("artist_id", artistId);
  if (error) {
    console.error("Error checking user like:", error);
    return false;
  }

  if (data.length > 0) {
    return true;
  } else {
    return false;
  }
};

// add user like
export const addArtistLike = async (userId, artistId) => {
  const { error } = await supabase
    .from("userLikedArtists")
    .insert([{ user_id: userId, artist_id: artistId }]);
  if (error) {
    console.error("Error adding user like:", error);
  }
};

// remove user like
export const removeArtistLike = async (userId, artistId) => {
  const { error } = await supabase
    .from("userLikedArtists")
    .delete()
    .match({ user_id: userId, artist_id: artistId });
  if (error) {
    console.error("Error removing user like:", error);
  }
};

//NOTE: Fetch Favorite Artists For Feed Page

export const favoriteArtist = async (userId) => {
  const { data, error } = await supabase
    .from("userLikedArtists")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching liked artists:", error);
    return [];
  }

  return data;
};

export const fetchLikedArtistsData = async (userId) => {
  const likedArtists = await favoriteArtist(userId);
  const likedArtistsArray = [];

  for (const artist of likedArtists) {
    const { data, error } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", artist.artist_id);

    if (error) {
      console.error("Error fetching artist data:", error);
      continue;
    }

    if (data.length > 0) {
      likedArtistsArray.push(data[0]);
    }
  }

  return likedArtistsArray;
};

//NOTE: Fetch User based on userId for Feed liked artists and NFT artist and collector pages
export const fetchUserDetails = async (artistId) => {
  const { data: artistData, error: ownerError } = await supabase
    .from("userDatabase")
    .select("*")
    .eq("userId", artistId);

  if (ownerError) {
    throw new Error(ownerError.message);
  }

  if (artistData.length === 0) {
    throw new Error("User not found");
  }
  return artistData;
};

// NOTE: Get tickets experienceID
export const fetchUserUpcomingEvents = async (userId) => {
  const { data: userTickets, error: ticketError } = await supabase
    .from("globalTickets")
    .select("experience_id, ticket_id")
    .eq("user_id", userId);

  if (ticketError) {
    console.error("Error fetching tickets:", ticketError);
    throw new Error(ticketError.message);
  }

  if (!userTickets || userTickets.length === 0) {
    console.warn("No tickets found for user:", userId);
    return [];
  }

  return userTickets;
};

// Check experiences' completion and return each experience's ticket_id
export const checkExperiencesCompletion = async (userTickets) => {
  try {
    // Extract experience IDs
    const experienceIds = userTickets.map((ticket) => ticket.experience_id);

    const { data: experiences, error } = await supabase
      .from("experiencesDatabase")
      .select("*")
      .in("experience_id", experienceIds); // Fetch experiences based on the IDs

    if (error) {
      console.error("Error fetching experiences:", error);
      throw new Error(error.message);
    }

    if (!experiences || experiences.length === 0) {
      console.warn("No experiences found for given IDs:", experienceIds);
      return { notCompletedExperiences: [], completedExperiences: [] };
    }

    // Map experience IDs to ticket IDs
    const experienceMap = userTickets.reduce((acc, ticket) => {
      if (!acc[ticket.experience_id]) {
        acc[ticket.experience_id] = [];
      }
      acc[ticket.experience_id].push(ticket.ticket_id);
      return acc;
    }, {});

    // Filter completed and not completed experiences
    const notCompletedExperiences = experiences
      .filter((experience) => !experience.completed)
      .map((experience) => ({
        ...experience,
        ticket_id: experienceMap[experience.experience_id] || [],
      }));
    const completedExperiences = experiences
      .filter((experience) => experience.completed)
      .map((experience) => ({
        ...experience,
        ticket_id: experienceMap[experience.experience_id] || [],
      }));

    return { notCompletedExperiences, completedExperiences };
  } catch (error) {
    console.error("Error processing experiences:", error);
    throw new Error(error.message);
  }
};

// // Check experiencesID if experience is completed or not
// export const checkExperiencesCompletion = async (experienceIds) => {
//   try {
//     const { data: experiences, error } = await supabase
//       .from("experiencesDatabase")
//       .select("*")
//       .in("experience_id", experienceIds); //to get for each experienceId in experienceIds array from mapping array in frontend

//     if (error) {
//       console.error("Error fetching experiences:", error);
//       throw new Error(error.message);
//     }

//     if (!experiences || experiences.length === 0) {
//       console.warn("No experiences found for given IDs:", experienceIds);
//       return { notCompletedExperiences: [], completedExperiences: [] };
//     }

//     const notCompletedExperiences = experiences.filter(
//       (experience) => !experience.completed
//     );
//     const completedExperiences = experiences.filter(
//       (experience) => experience.completed
//     );

//     return { notCompletedExperiences, completedExperiences };
//   } catch (error) {
//     console.error("Error processing experiences:", error);
//     throw new Error(error.message);
//   }
// };

// NOTE: Get ticket data based on ticketId, userId, experienceId
export const fetchUserEvent = async (ticketId, userId, experienceId) => {
  try {
    // Fetch user tickets and experience data in parallel
    const [
      { data: userTickets, error: ticketError },
      { data: userExperienceData, error: experienceError },
    ] = await Promise.all([
      supabase
        .from("globalTickets")
        .select("*")
        .eq("ticket_id", ticketId)
        .eq("user_id", userId)
        .eq("experience_id", experienceId),
      supabase
        .from("experiencesDatabase")
        .select("*")
        .eq("experience_id", experienceId),
    ]);

    // Handle any errors
    if (ticketError) {
      console.error("Error fetching tickets:", ticketError);
      throw new Error(ticketError.message);
    }
    if (experienceError) {
      console.error("Error fetching experiences:", experienceError);
      throw new Error(experienceError.message);
    }

    // Check if data exists
    if (!userTickets || userTickets.length === 0) {
      console.warn("No tickets found for given parameters.");
      return [];
    }
    if (!userExperienceData || userExperienceData.length === 0) {
      console.warn("No experiences found for given parameters.");
      return [];
    }

    // Return combined data
    return { userTickets, userExperienceData };
  } catch (error) {
    console.error("Error fetching user event:", error);
    throw new Error(error.message);
  }
};

// NOTE: Get & Group Past Experiences By Ticket Location
export const fetchPastCities = (experiencesData) => {
  if (!experiencesData || experiencesData.length === 0) {
    console.warn("No experiences data provided.");
    return {};
  }

  // Group experiences by city
  const pastCities = experiencesData.reduce((acc, experience) => {
    const city = experience.experience_city;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(experience);
    return acc;
  }, {});

  return pastCities;
};

export const fetchPastCitiesTickets = async (userId, pastLocation) => {
  try {
    // First, fetch the completed experience IDs
    const { data: completedExperiences, error: experiencesError } =
      await supabase
        .from("experiencesDatabase")
        .select("experience_id")
        .eq("completed", true)
        .eq("experience_city", pastLocation);

    if (experiencesError) {
      console.error("Error fetching completed experiences:", experiencesError);
      throw new Error(experiencesError.message);
    }

    if (!completedExperiences || completedExperiences.length === 0) {
      console.warn(
        "No completed experiences found for the given location:",
        pastLocation
      );
      return [];
    }

    // Extract experience IDs
    const experienceIds = completedExperiences.map((exp) => exp.experience_id);

    // Then, fetch the user tickets for those experiences
    const { data: userPastTickets, error: ticketError } = await supabase
      .from("globalTickets")
      .select(
        "*, experiencesDatabase(experience_city, experience_name, artist_id, experience_banner)"
      )
      .eq("user_id", userId)
      .in("experience_id", experienceIds);

    if (ticketError) {
      console.error("Error fetching tickets:", ticketError);
      throw new Error(ticketError.message);
    }

    if (!userPastTickets || userPastTickets.length === 0) {
      console.warn(
        "No completed tickets found for the given location:",
        pastLocation
      );
      return [];
    }

    console.log(userPastTickets);
    return userPastTickets;
  } catch (error) {
    console.error("Error fetching past cities tickets:", error);
    throw new Error(error.message);
  }
};

//Note: Fetch user liked experience
// update favorite counter on NFT page
export const updateExperienceFavoriteCount = async (experienceId, newCount) => {
  const { data, error } = await supabase
    .from("experiencesDatabase")
    .update({ favorite_count: newCount })
    .eq("experience_id", experienceId);

  if (error) {
    console.error("Error updating favorite count:", error);
  } else {
    console.log("Favorite count updated:", data);
  }
};
// check if user has liked the experience in the userLikedExperiences table
export const checkUserLikedExperience = async (userId, experienceId) => {
  const { data, error } = await supabase
    .from("userLikedExperiences")
    .select("*")
    .eq("user_id", userId)
    .eq("experience_id", experienceId);

  if (error) {
    console.error("Error checking user like:", error);
    return false;
  }
  return data.length > 0;
};

// add user like in the userLikedExperiences table
export const addUserLikedExperience = async (userId, experienceId) => {
  const { error } = await supabase
    .from("userLikedExperiences")
    .insert([{ user_id: userId, experience_id: experienceId }]);
  if (error) {
    console.error("Error adding user like:", error);
  }
};

// remove user like from the userLikedExperiences table
export const removeUserLikedExperience = async (userId, experienceId) => {
  const { error } = await supabase
    .from("userLikedExperiences")
    .delete()
    .match({ user_id: userId, experience_id: experienceId });
  if (error) {
    console.error("Error removing user like:", error);
  }
};

// get experiences data based one experienceId
export const getIndividualExperienceData = async (experienceId) => {
  try {
    // Fetch the NFT data
    const { data: experienceData, error: expError } = await supabase
      .from("experiencesDatabase")
      .select("*")
      .eq("experience_id", experienceId);

    if (expError) {
      console.error("Error fetching Experience data:", expError.message);
      throw expError;
    }

    const experience = experienceData[0];
    if (!experience) {
      throw new Error("Experience not found");
    }

    const { artist_id } = experience;

    // Fetch the creator data
    const { data: creatorData, error: creatorError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", artist_id);

    if (creatorError) {
      console.error("Error fetching creator data:", creatorError.message);
      throw creatorError;
    }

    return { experience, creator: creatorData[0] };
  } catch (error) {
    console.error("Error fetching Experience and related data:", error.message);
    throw error;
  }
};

// NOTE: Returns all rows where the user is the one that has been followed
export const getFollowingUsers = async (userId) => {
  try {
    let { data: followingUsers, error } = await supabase
      .from("followingList")
      .select("user_who_followed_id")
      .eq("user_who_was_followed_id", userId);

    if (error) {
      console.error("Error fetching following users:", error.message);
      return [];
    }

    if (!followingUsers || followingUsers.length === 0) {
      console.warn("No following users found for userId:", userId);
      return [];
    }

    return followingUsers;
  } catch (error) {
    console.error(`getFollowingUsers threw an error: ${error.message}`);
    throw new Error(`getFollowingUsers threw an error: ${error.message}`);
  }
};

// NOTE: Returns all rows where the user is the one that has followed other users
export const getFollowedUsers = async (userId) => {
  try {
    let { data: followedUsers, error } = await supabase
      .from("followingList")
      .select("user_who_was_followed_id")
      .eq("user_who_followed_id", userId);

    if (error) {
      console.error("Error fetching followed users:", error.message);
      return [];
    }

    if (!followedUsers || followedUsers.length === 0) {
      console.warn("No followed users found for userId:", userId);
      return [];
    }

    return followedUsers;
  } catch (error) {
    console.error(`getFollowedUsers threw an error: ${error.message}`);
    throw new Error(`getFollowedUsers threw an error: ${error.message}`);
  }
};

//TODO: THIS FUNCTION IS FOR THE GAME BACKEND AND FOR ARTISTS PROFILES ONLY
// NOTE: Creates a follow relationship between two users
export const followUserFunction = async (followerId, followedId) => {
  try {
    let { error } = await supabase.from("followingList").insert([
      {
        user_who_followed_id: followerId,
        user_who_was_followed_id: followedId,
      },
    ]);

    if (error) {
      console.error("Error creating follow relationship:", error.message);
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`followUser threw an error: ${error.message}`);
  }
};
//TODO: THIS FUNCTION IS FOR THE GAME BACKEND AND FOR ARTISTS PROFILES ONLY
// NOTE: Unfollows a user by deleting the relationship
export const unfollowUserFunction = async (followerId, followedId) => {
  try {
    let { error } = await supabase
      .from("followingList")
      .delete()
      .eq("user_who_followed_id", followerId)
      .eq("user_who_was_followed_id", followedId);

    if (error) {
      console.error("Error unfollowing user:", error.message);
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`unfollowUser threw an error: ${error.message}`);
  }
};

//NOTE: CHECK IF USER FOLLOWS A USER
export const checkUserFollow = async (userId, followedUserId) => {
  const { data, error } = await supabase
    .from("followingList")
    .select("*")
    .eq("user_who_followed_id", userId)
    .eq("user_who_was_followed_id", followedUserId);

  if (error) {
    console.error("Error checking user follow:", error);
    return false;
  }
  return data.length > 0;
};

//NOTE:FETCH AND CHOOSE A FANDOM

// Fetch all fandoms from the database with their ids
export const fetchFandoms = async () => {
  const { data, error } = await supabase
    .from("fandomsDatabase")
    .select("fandom_id, fandom_name");

  if (error) {
    console.error("Error fetching fandoms:", error);
    return [];
  }
  return data;
};

export const handleFandomSelection = async (
  userId,
  selectedFandomId,
  selectedFandomName
) => {
  try {
    // Check if the user is already subscribed to any fandom
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("fandomSubscribers")
      .select("user_id, fandom_id")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    let fandomSubscriptionResult;

    if (existingSubscription) {
      // If user is already subscribed, update the existing subscription
      const { data, error: updateError } = await supabase
        .from("fandomSubscribers")
        .update({ fandom_id: selectedFandomId })
        .eq("user_id", userId)
        .single();

      if (updateError) {
        throw updateError;
      }

      fandomSubscriptionResult = data;
    } else {
      // If user is not subscribed, create a new subscription
      const { data, error: insertError } = await supabase
        .from("fandomSubscribers")
        .insert([{ user_id: userId, fandom_id: selectedFandomId }])
        .single();

      if (insertError) {
        throw insertError;
      }

      fandomSubscriptionResult = data;
    }

    // Update the userDatabase with the new fandom
    const { data: userData, error: userUpdateError } = await supabase
      .from("userDatabase")
      .update({ currentFandom: selectedFandomName })
      .eq("userId", userId)
      .single();

    if (userUpdateError) {
      throw userUpdateError;
    }

    console.log("Updated fandom subscription and user profile:", {
      fandomSubscription: fandomSubscriptionResult,
      userUpdate: userData,
    });
    return {
      fandomSubscription: fandomSubscriptionResult,
      userUpdate: userData,
    };
  } catch (error) {
    console.error("Error handling fandom selection:", error);
    throw error;
  }
};

// NOTE: Experience post functions in user's profiles

export const getUserSubscribedExperiencesData = async (userId) => {
  try {
    const { data: userExperiences, error } = await supabase
      .from("userExperiences")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error(
        `Error fetching subscribed experiences: ${error.message}`
      );
    }

    return userExperiences;
  } catch (error) {
    console.error("Error in getUserSubscribedExperiencesData:", error);
    return null; // or return an empty array, depending on how you handle null cases
  }
};

export const getExperienceById = async (experienceId) => {
  try {
    const { data: experiencesDatabase, error } = await supabase
      .from("experiencesDatabase")
      .select("*")
      .eq("experience_id", experienceId);

    if (error) {
      throw new Error(`Error fetching experience by ID: ${error.message}`);
    }

    return experiencesDatabase;
  } catch (error) {
    console.error("Error in getExperienceById:", error);
    return null; // or return an empty object/array
  }
};

export const getPlayedDataByUserAndExpId = async (userId, experienceId) => {
  try {
    const { data: userExperiences, error } = await supabase
      .from("userExperiences")
      .select("*")
      .eq("user_id", userId)
      .eq("experience_id", experienceId);

    if (error) {
      throw new Error(
        `Error fetching played data by user and experience ID: ${error.message}`
      );
    }

    return userExperiences;
  } catch (error) {
    console.error("Error in getPlayedDataByUserAndExpId:", error);
    return null; // or return an empty object/array
  }
};

//NOTE: Get user posts
export const getUserPosts = async (userId) => {
  try {
    const { data: userPosts, error } = await supabase
      .from("userPosts")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Error fetching user posts: ${error.message}`);
    }

    return userPosts;
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return null; // or return an empty array, depending on how you handle null cases
  }
};

//NOTE: Get posts by postId
export const getPostById = async (postId) => {
  try {
    const { data: userPosts, error } = await supabase
      .from("userPosts")
      .select("*")
      .eq("post_id", postId);

    if (error) {
      throw new Error(`Error fetching user posts: ${error.message}`);
    }

    return userPosts;
  } catch (error) {
    console.error("Error in getPostById:", error);
    return null; // or return an empty array, depending on how you handle null cases
  }
};

//NOTE: Check if User Has Already liked a post
export const checkUserLikeOnPost = async (userId, postId) => {
  try {
    const { data, error } = await supabase
      .from("userLikedPosts")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) {
      console.error("Error checking user like on post:", error);
      return false;
    }
    return data.length > 0;
  } catch (error) {
    throw new Error(`checkUserLikeOnPost threw an error: ${error.message}`);
  }
};

//NOTE: Add like to post by user

export const addUserLikeOnPost = async (userId, postId) => {
  try {
    let { error } = await supabase.from("userLikedPosts").insert([
      {
        user_id: userId,
        post_id: postId,
      },
    ]);

    if (error) {
      console.error(
        "Error creating user-post like relationship:",
        error.message
      );
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`addUserLikeOnPost threw an error: ${error.message}`);
  }
};

//NOTE: Remove like to post by user

export const removeUserLikeOnPost = async (userId, postId) => {
  try {
    let { error } = await supabase
      .from("userLikedPosts")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) {
      console.error("Error unliking post:", error.message);
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`removeUserLikeOnPost threw an error: ${error.message}`);
  }
};

//NOTE: Update Like Counter

export const updateLikeCounterOnUserLikedPosts = async (postId, newCount) => {
  try {
    const { data, error } = await supabase
      .from("userPosts")
      .update({ favorite_count: newCount })
      .eq("post_id", postId);

    if (error) {
      console.error("Error updating favorite count in userPosts table:", error);
    } else {
      console.log("Favorite count updated:", data);
    }
  } catch (error) {
    throw new Error(
      `updateLikeCounterOnUserLikedPosts threw an error: ${error.message}`
    );
  }
};

//NOTE: Fetch Comments from Posts

// Fetch Comments from Posts with Pagination
export const fetchCommentsByPostId = async (postId, page = 1, limit = 10) => {
  try {
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data: postComments, error } = await supabase
      .from("userCommentsOnPosts")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true }) // Assuming there's a created_at column
      .range(from, to);

    if (error) {
      console.error("Error reading postComments:", error);
      return [];
    }
    return postComments;
  } catch (error) {
    throw new Error(`postComments threw an error: ${error.message}`);
  }
};

//NOTE:  Add Comment To Post

export const addCommentToPost = async (postId, userId, comment) => {
  try {
    let { error } = await supabase.from("userCommentsOnPosts").insert([
      {
        user_id: userId,
        post_id: postId,
        comment_content: comment,
      },
    ]);

    if (error) {
      console.error("Error creating post at addCommentToPost:", error.message);
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`addCommentToPost threw an error: ${error.message}`);
  }
};

//NOTE: Check if User Has Already liked a comment
export const checkUserLikeOnCommentOnPost = async (userId, commentId) => {
  try {
    const { data, error } = await supabase
      .from("userLikedComments")
      .select("*")
      .eq("user_id", userId)
      .eq("comment_id", commentId);

    if (error) {
      console.error("Error checking user like on comment:", error);
      return false;
    }
    return data.length > 0;
  } catch (error) {
    throw new Error(
      `checkUserLikeOnCommentOnPost threw an error: ${error.message}`
    );
  }
};

//NOTE: Add like to comment by user

export const addUserLikeOnCommentOnPost = async (userId, commentId) => {
  try {
    let { error } = await supabase.from("userLikedComments").insert([
      {
        user_id: userId,
        comment_id: commentId,
      },
    ]);

    if (error) {
      console.error(
        "Error creating user-comment like relationship:",
        error.message
      );
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(
      `addUserLikeOnCommentOnPost threw an error: ${error.message}`
    );
  }
};

//NOTE: Remove like to comment by user

export const removeUserLikeOnCommentOnPost = async (userId, commentId) => {
  try {
    let { error } = await supabase
      .from("userLikedComments")
      .delete()
      .eq("user_id", userId)
      .eq("comment_id", commentId);

    if (error) {
      console.error("Error unliking comment:", error.message);
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(
      `removeUserLikeOnCommentOnPost threw an error: ${error.message}`
    );
  }
};

//NOTE: Update Like Counter on Comment

export const updateLikeCounterOnUserCommentsOnPosts = async (
  commentId,
  newCount
) => {
  try {
    const { data, error } = await supabase
      .from("userCommentsOnPosts")
      .update({ favorite_count: newCount })
      .eq("comment_id", commentId);

    if (error) {
      console.error(
        "Error updating favorite count in userCommentsOnPosts table:",
        error
      );
    } else {
      console.log("Favorite count updated:", data);
    }
  } catch (error) {
    throw new Error(
      `updateLikeCounterOnUserCommentsOnPosts threw an error: ${error.message}`
    );
  }
};

//TODO:

//NOTE: Fetch Replies from Comments on Posts

// Fetch Replies from Comments on Posts with Pagination
export const fetchRepliesOnCommentsByCommentId = async (
  commentId,
  page = 1,
  limit = 10
) => {
  try {
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data: commentReplies, error } = await supabase
      .from("userRepliesToPostComments")
      .select("*")
      .eq("comment_id", commentId)
      .order("created_at", { ascending: true }) // Assuming there's a created_at column
      .range(from, to);

    if (error) {
      console.error("Error reading commentReplies:", error);
      return [];
    }
    return commentReplies;
  } catch (error) {
    throw new Error(
      `userRepliesToPostComments threw an error: ${error.message}`
    );
  }
};

//NOTE:  Add Reply To Comment

export const addReplyToComment = async (commentId, postId, userId, reply) => {
  try {
    let { error } = await supabase.from("userRepliesToPostComments").insert([
      {
        user_id: userId,
        post_id: postId,
        comment_id: commentId,
        reply_content: reply,
      },
    ]);

    if (error) {
      console.error("Error creating post at addReplyToComment:", error.message);
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(`addReplyToComment threw an error: ${error.message}`);
  }
};

//NOTE: Check if User Has Already liked a reply
export const checkUserLikeOnReplyOnComment = async (userId, replyId) => {
  try {
    const { data, error } = await supabase
      .from("userLikedReplies")
      .select("*")
      .eq("user_id", userId)
      .eq("reply_id", replyId);

    if (error) {
      console.error("Error checking user like on reply:", error);
      return false;
    }
    return data.length > 0;
  } catch (error) {
    throw new Error(
      `checkUserLikeOnReplyOnComment threw an error: ${error.message}`
    );
  }
};

//NOTE: Add like to reply by user

export const addUserLikeOnReplyOnComment = async (userId, replyId) => {
  try {
    let { error } = await supabase.from("userLikedReplies").insert([
      {
        user_id: userId,
        reply_id: replyId,
      },
    ]);

    if (error) {
      console.error(
        "Error creating user-reply like relationship:",
        error.message
      );
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(
      `addUserLikeOnReplyOnComment threw an error: ${error.message}`
    );
  }
};

//NOTE: Remove like to reply by user

export const removeUserLikeOnReplyOnComment = async (userId, replyId) => {
  try {
    let { error } = await supabase
      .from("userLikedReplies")
      .delete()
      .eq("user_id", userId)
      .eq("reply_id", replyId);

    if (error) {
      console.error("Error unliking reply:", error.message);
      return { success: false, message: error.message };
    }
  } catch (error) {
    throw new Error(
      `removeUserLikeOnReplyOnComment threw an error: ${error.message}`
    );
  }
};

//NOTE: Update Like Counter on Reply

export const updateLikeCounterOnUserReplyOnComment = async (
  replyId,
  newCount
) => {
  try {
    const { data, error } = await supabase
      .from("userRepliesToPostComments")
      .update({ favorite_count: Number(newCount) })
      .eq("reply_id", replyId);

    if (error) {
      console.error("Error updating favorite count:", error);
    } else {
      console.log("Favorite count updated:", data);
    }
  } catch (error) {
    throw new Error(
      `updateLikeCounterOnUserReplyOnComment threw an error: ${error.message}`
    );
  }
};

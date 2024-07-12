import { Alert } from "react-native";
import { supabase } from "./supabase";
import { decode } from "base64-arraybuffer";

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
  const updates = {
    username: form.username,
    // email: form.email,
    bio: form.bio,
    currentFandom: form.fandom,
    avatar: avatarUrl || form.avatar,
  };

  try {
    const { data, error } = await supabase
      .from("userDatabase")
      .update(updates)
      .eq("userId", authUser.userId);

    if (error) {
      throw error;
    }

    Alert.alert("Success", "Profile updated successfully");
  } catch (error) {
    Alert.alert("Error", `Profile update failed: ${error.message}`);
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

// export const getIndividualNFTData = async (userId) => {
//   try {
//     let { data: userData, error } = await supabase
//       .from("userDatabase")
//       .select("*")
//       .eq("userId", userId);

//     if (error) {
//       console.error("Error fetching user data:", error.message);
//       throw error;
//     }

//     console.log("User Data:", userData); // Log the fetched data
//     return userData;
//   } catch (error) {
//     console.error("Error fetching user data:", error.message);
//     throw error;
//   }
// };

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

    console.log("NFT Creator ID:", creator_id);
    console.log("NFT Owner ID:", owner_id);

    // Fetch the creator data
    const { data: creatorData, error: creatorError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", creator_id);

    if (creatorError) {
      console.error("Error fetching creator data:", creatorError.message);
      throw creatorError;
    }

    console.log("Creator Data Response:", creatorData);

    // Fetch the owner data
    const { data: ownerData, error: ownerError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", owner_id);

    if (ownerError) {
      console.error("Error fetching owner data:", ownerError.message);
      throw ownerError;
    }

    console.log("Owner Data Response:", ownerData);

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

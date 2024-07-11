import { Alert } from "react-native";
import { supabase } from "./supabase";
import { decode } from "base64-arraybuffer";

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

export const getIndividualNFTCreator = async (nftCreatorId) => {
  try {
    let { data: creatorData, error } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", nftCreatorId);

    if (error) throw error;

    return creatorData;
  } catch (error) {
    console.error("Error fetching NFTs: ", error.message);
    throw error;
  }
};

export const getIndividualNFTOwner = async (nftOwnerId) => {
  try {
    let { data: ownerData, error } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("userId", nftOwnerId);

    if (error) throw error;

    return ownerData;
  } catch (error) {
    console.error("Error fetching NFTs: ", error.message);
    throw error;
  }
};

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import { icons, images } from "../../../constants";
import EditFields from "../../../components/ProfileComponents/EditFields";
import { router } from "expo-router";
import TextBold18 from "../../../components/Typography/TextBold18";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import GlassContainer from "../../../components/BackgroundContainers/GlassContainer";
import TextSemi18 from "../../../components/Typography/TextSemi18";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import { useAuth } from "../../../context/AuthProvider";
import {
  uploadAvatar,
  fetchFandoms,
  handleFandomSelection,
} from "../../../api/supabase_api";

const UserProfile = () => {
  const { authUser, updateAuthUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(true);
  const [fandoms, setFandoms] = useState([]);
  const [form, setForm] = useState({
    username: authUser?.username || "",
    bio: authUser?.bio || "",
    fandom: authUser?.currentFandom || "",
    avatar: authUser?.avatar || null,
    base64: "",
  });

  useEffect(() => {
    const getAllFandoms = async () => {
      const fandoms = await fetchFandoms();
      setFandoms(fandoms);
    };

    getAllFandoms();
  }, []);

  useEffect(() => {
    if (editing === true) {
      setForm((prevForm) => ({
        ...prevForm,
        username: authUser.username || "",
        bio: authUser.bio || "",
        fandom: authUser.currentFandom || "",
        avatar: authUser.avatar || null,
      }));
    }
  }, [editing]);

  const openAvatarPicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        avatar: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  };

  const handleFandomSelect = async (fandomName, fandomId) => {
    try {
      // Update the selected fandom in the form state
      setForm((prevForm) => ({ ...prevForm, fandom: fandomName }));

      // Handle the backend logic of subscribing to the fandom and updating user profile
      await handleFandomSelection(authUser?.userId, fandomId, fandomName);

      // Update the authUser context
      const result = await updateAuthUser({ currentFandom: fandomName });
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error updating fandom:", error);
      Alert.alert("Error", "Failed to update fandom. Please try again.");
      // Revert the form state if the update fails
      setForm((prevForm) => ({
        ...prevForm,
        fandom: authUser?.currentFandom || "",
      }));
    }
  };

  const submitChanges = async () => {
    if (!form.content_text || !form.fandom) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setUploading(true);
      const mediaUpload = await uploadPostMedia(authUser, form, setUploading);

      const postData = {
        content: form.content_text,
        media: await mediaUpload, // Ensure media URLs are correctly passed
        user_id: authUser.userId,
        post_location: form.location,
        post_fandom_name: form.fandom,
        post_song: form.music,
      };

      const post = await publishPost(postData);

      if (!post.success) {
        throw new Error(post.message);
      }

      Alert.alert("Success", "Post published successfully");
      router.push("/profile"); // Navigate to user profile
    } catch (error) {
      console.error("Error publishing post:", error);
      Alert.alert("Error", "Failed to publish post. Please try again.");
    } finally {
      setEditing(false);
      setUploading(false);
    }
  };

  const handleBack = () => {
    router.push("/profile");
  };

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <Image
          source={images.loginBG}
          resizeMode="contain"
          className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
        />
        <View className="mt-10 w-screen p-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={handleBack}>
            <Image source={icons.backArrow} resizeMethod="contain" />
          </TouchableOpacity>
          <TextBold18>Profile Edit</TextBold18>
        </View>
        <BgBlackOverlay>
          <ScrollView>
            <View className="flex-col items-center w-screen p-4 h-full">
              <EditFields
                label={"Username"}
                icon="user"
                value={form.username}
                iconsLibrary="FontAwesome"
                onChangeText={(username) => setForm({ ...form, username })}
              />
              <EditFields
                label={"Bio"}
                icon="info-with-circle"
                value={form.bio}
                iconsLibrary="Entypo"
                onChangeText={(bio) => setForm({ ...form, bio })}
                extraClasses="mt-4"
              />
              {/* Fandom Picker */}
              <View className="w-full mt-4">
                <TextSemi18 extraClasses={"pb-2 pl-2"}>Fandom</TextSemi18>
                <GlassContainer
                  insideContainerClasses={
                    "flex-row items-center justify-between"
                  }
                >
                  <Picker
                    selectedValue={form.fandom}
                    onValueChange={(itemValue, itemIndex) => {
                      const selectedFandomId =
                        fandoms[itemIndex - 1]?.fandom_id;
                      handleFandomSelect(itemValue, selectedFandomId);
                    }}
                    style={{ width: "100%", color: "white" }}
                  >
                    <Picker.Item label="Select a Fandom" value="None" />
                    {fandoms.map((fandom) => (
                      <Picker.Item
                        key={fandom.fandom_id}
                        label={fandom.fandom_name}
                        value={fandom.fandom_name}
                      />
                    ))}
                  </Picker>
                </GlassContainer>
              </View>
              {/* Avatar Picker */}
              <View className="flex-col mt-4">
                <TextSemi18 extraClasses={"pb-2 pl-2"}>Avatar</TextSemi18>
                <GlassContainer
                  insideContainerClasses={
                    "flex-row items-center justify-between"
                  }
                >
                  {form.avatar ? (
                    <Image
                      source={{ uri: form.avatar }}
                      resizeMode="cover"
                      className="w-[100px] h-[100px] rounded-full "
                    />
                  ) : (
                    <Text className="flex-1 text-white font-mregular mt-0.5 text-base">
                      Choose an Avatar
                    </Text>
                  )}
                  <TouchableOpacity onPress={openAvatarPicker}>
                    <View className="w-14 h-14 border border-dashed border-purple-100 flex justify-center items-center">
                      <Entypo name="upload-to-cloud" size={24} color="white" />
                    </View>
                  </TouchableOpacity>
                </GlassContainer>
              </View>
              <View className="w-screen items-end mt-10 p-3">
                <SubmitButton
                  label={"Submit Updates"}
                  extraClasses="w-[200px] h-[50px]"
                  onPress={submitChanges}
                />
              </View>
            </View>
          </ScrollView>
        </BgBlackOverlay>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default UserProfile;

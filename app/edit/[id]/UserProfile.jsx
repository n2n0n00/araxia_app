import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
import { icons, images } from "../../../constants";
import AraxiaHeadBar from "../../../components/HeadBars/AraxiaHeadBar";
import EditFields from "../../../components/ProfileComponents/EditFields";
import { router } from "expo-router";
import TextBold18 from "../../../components/Typography/TextBold18";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import GlassContainer from "../../../components/BackgroundContainers/GlassContainer";
import TextSemi18 from "../../../components/Typography/TextSemi18";
import SubmitButton from "../../../components/Buttons/SubmitButton";
import { useAuth } from "../../../context/AuthProvider";
import { supabase } from "../../../api/supabase";
import { decode } from "base64-arraybuffer";

const UserProfile = () => {
  const { authUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
    fandom: authUser?.currentFandom || "",
    avatar: authUser?.avatar || null,
    base64: "",
  });

  useEffect(() => {
    setForm({
      username: authUser?.username || "",
      email: authUser?.email || "",
      bio: authUser?.bio || "",
      fandom: authUser?.currentFandom || "",
      avatar: authUser?.avatar || null,
      base64: "" || null,
    });
  }, []);

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
      aspect: [4, 3],
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

  const uploadAvatar = async () => {
    if (!form.avatar) {
      Alert.alert("Error", "Please select an avatar image first.");
      return null;
    }

    setUploading(true);
    const file = await fetch(form.avatar);
    const fileType = file._bodyBlob._data.type;

    const fileName = `${authUser.userId}/avatar.${
      fileType == "image/jpeg"
        ? "jpeg"
        : fileType == "image/png"
        ? "png"
        : "jpg"
    }`;

    try {
      const { data, error } = await supabase.storage
        .from("userAvatar")
        .remove([
          `${authUser.userId}/avatar.png`,
          `${authUser.userId}/avatar.jpeg`,
          `${authUser.userId}/avatar.jpg`,
          `${authUser.userId}/avatar.undefined`,
        ]);
    } catch (error) {
      console.log(error.message);
    }

    try {
      const { data, error } = await supabase.storage
        .from("userAvatar")
        .upload(fileName, decode(form.base64), {
          contentType: fileType,
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const getImageUrl = supabase.storage
        .from("userAvatar")
        .getPublicUrl(fileName);

      const avatarUrl = getImageUrl.data.publicUrl;

      return `${avatarUrl}?t=${new Date().getTime()}`;
    } catch (error) {
      console.log(error.message);
      Alert.alert("Error", `Avatar upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateUserProfile = async (avatarUrl) => {
    const updates = {
      username: form.username,
      email: form.email,
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

  const submitChanges = async () => {
    if (!form.username || !form.email || !form.bio || !form.fandom) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const avatarUrl = await uploadAvatar();
    await updateUserProfile(avatarUrl);

    router.push("/profile");
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
                label={"Email"}
                icon="email"
                value={form.email}
                iconsLibrary="Entypo"
                onChangeText={(email) => setForm({ ...form, email })}
                extraClasses="mt-4"
              />
              <EditFields
                label={"Bio"}
                icon="info-with-circle"
                value={form.bio}
                iconsLibrary="Entypo"
                onChangeText={(bio) => setForm({ ...form, bio })}
                extraClasses="mt-4"
              />
              <EditFields
                label={"Fandom"}
                icon="lightbulb-o"
                value={form.fandom}
                iconsLibrary="FontAwesome"
                onChangeText={(fandom) => setForm({ ...form, fandom })}
                extraClasses="mt-4"
              />
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
                      className="w-[100px] h-[100px] rounded-full"
                    />
                  ) : (
                    <Text className="flex-1 text-white font-mregular mt-0.5 text-base">
                      Choose an Avatar
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => openAvatarPicker("image")}>
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

// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import BgDarkGradient from "../../../components/BackgroundGradients/BgDarkGradient";
// import BgBlackOverlay from "../../../components/BackgroundGradients/BgBlackOverlay";
// import { icons, images } from "../../../constants";
// import AraxiaHeadBar from "../../../components/HeadBars/AraxiaHeadBar";
// import EditFields from "../../../components/ProfileComponents/EditFields";
// import { router } from "expo-router";
// import TextBold18 from "../../../components/Typography/TextBold18";
// import Entypo from "@expo/vector-icons/Entypo";
// import * as ImagePicker from "expo-image-picker";
// import GlassContainer from "../../../components/BackgroundContainers/GlassContainer";
// import TextSemi18 from "../../../components/Typography/TextSemi18";
// import SubmitButton from "../../../components/Buttons/SubmitButton";
// import { useAuth } from "../../../context/AuthProvider";
// import { supabase } from "../../../api/supabase";
// import { decode } from "base64-arraybuffer";

// const UserProfile = () => {
//   const { authUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [form, setForm] = useState({
//     username: authUser?.username || "",
//     email: authUser?.email || "",
//     bio: authUser?.bio || "",
//     fandom: authUser?.currentFandom || "",
//     avatar: authUser?.avatar || null,
//   });

//   useEffect(() => {
//     setForm({
//       username: authUser?.username || "",
//       email: authUser?.email || "",
//       bio: authUser?.bio || "",
//       fandom: authUser?.currentFandom || "",
//       avatar: authUser?.avatar || null,
//     });
//   }, []);

//   const openAvatarPicker = async () => {
//     let permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permissionResult.granted === false) {
//       Alert.alert(
//         "Permission required",
//         "Permission to access camera roll is required!"
//       );
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setForm({ ...form, avatar: result.assets[0].uri });
//     }
//   };

//   const uploadAvatar = async () => {
//     if (!form.avatar) {
//       Alert.alert("Error", "Please select an avatar image first.");
//       return null;
//     }

//     setUploading(true);
//     const file = await fetch(form.avatar);
//     // const blob = await file.blob();
//     const fileName = `${authUser.userId}/avatar.jpg`;

//     try {
//       const { data, error } = await supabase.storage
//         .from("userAvatar")
//         .upload(fileName, decode("base64FileData"), {
//           contentType: "image/png" || "image/jpeg",
//         });

//       if (error) {
//         throw error;
//       }

//       const avatarUrl = supabase.storage
//         .from("userAvatar")
//         .getPublicUrl(fileName).data.publicUrl;
//       return avatarUrl;
//     } catch (error) {
//       Alert.alert("Error", `Avatar upload failed: ${error.message}`);
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   const updateUserProfile = async (avatarUrl) => {
//     const updates = {
//       username: form.username,
//       email: form.email,
//       bio: form.bio,
//       currentFandom: form.fandom,
//       avatar: avatarUrl || form.avatar,
//     };

//     try {
//       const { data, error } = await supabase
//         .from("userDatabase")
//         .update(updates)
//         .eq("userId", authUser.userId);

//       if (error) {
//         throw error;
//       }

//       Alert.alert("Success", "Profile updated successfully");
//     } catch (error) {
//       Alert.alert("Error", `Profile update failed: ${error.message}`);
//     }
//   };

//   const submitChanges = async () => {
//     if (!form.username || !form.email || !form.bio || !form.fandom) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     const avatarUrl = await uploadAvatar();
//     await updateUserProfile(avatarUrl);

//     router.push("/profile");
//   };

//   const handleBack = () => {
//     router.push("/profile");
//   };

//   return (
//     <SafeAreaView className="flex-1">
//       <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
//         <Image
//           source={images.loginBG}
//           resizeMode="contain"
//           className="w-screen h-full top-0 mt-6 rounded-3xl absolute"
//         />
//         <View className="mt-10 w-screen p-4 flex-row items-center justify-between">
//           <TouchableOpacity onPress={handleBack}>
//             <Image source={icons.backArrow} resizeMethod="contain" />
//           </TouchableOpacity>
//           <TextBold18>Profile Edit</TextBold18>
//         </View>
//         <BgBlackOverlay>
//           <ScrollView>
//             <View className="flex-col items-center w-screen p-4 h-full">
//               <EditFields
//                 label={"Username"}
//                 icon="user"
//                 value={form.username}
//                 iconsLibrary="FontAwesome"
//                 onChangeText={(username) => setForm({ ...form, username })}
//               />
//               <EditFields
//                 label={"Email"}
//                 icon="email"
//                 value={form.email}
//                 iconsLibrary="Entypo"
//                 onChangeText={(email) => setForm({ ...form, email })}
//                 extraClasses="mt-4"
//               />
//               <EditFields
//                 label={"Bio"}
//                 icon="info-with-circle"
//                 value={form.bio}
//                 iconsLibrary="Entypo"
//                 onChangeText={(bio) => setForm({ ...form, bio })}
//                 extraClasses="mt-4"
//               />
//               <EditFields
//                 label={"Fandom"}
//                 icon="lightbulb-o"
//                 value={form.fandom}
//                 iconsLibrary="FontAwesome"
//                 onChangeText={(fandom) => setForm({ ...form, fandom })}
//                 extraClasses="mt-4"
//               />
//               <View className="flex-col mt-4">
//                 <TextSemi18 extraClasses={"pb-2 pl-2"}>Avatar</TextSemi18>
//                 <GlassContainer
//                   insideContainerClasses={
//                     "flex-row items-center justify-between"
//                   }
//                 >
//                   {form.avatar ? (
//                     <Image
//                       source={{ uri: form.avatar }}
//                       resizeMode="cover"
//                       className="w-[100px] h-[100px] rounded-full"
//                     />
//                   ) : (
//                     <Text className="flex-1 text-white font-mregular mt-0.5 text-base">
//                       Choose an Avatar
//                     </Text>
//                   )}
//                   <TouchableOpacity onPress={() => openAvatarPicker("image")}>
//                     <View className="w-14 h-14 border border-dashed border-purple-100 flex justify-center items-center">
//                       <Entypo name="upload-to-cloud" size={24} color="white" />
//                     </View>
//                   </TouchableOpacity>
//                 </GlassContainer>
//               </View>
//               <View className="w-screen items-end mt-10 p-3">
//                 <SubmitButton
//                   label={"Submit Updates"}
//                   extraClasses="w-[200px] h-[50px]"
//                   onPress={submitChanges}
//                 />
//               </View>
//             </View>
//           </ScrollView>
//         </BgBlackOverlay>
//       </BgDarkGradient>
//     </SafeAreaView>
//   );
// };

// export default UserProfile;

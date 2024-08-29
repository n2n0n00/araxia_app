import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { icons } from "../../constants";
import { useAuth } from "../../context/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
import SubmitButton from "../../components/Buttons/SubmitButton";
import TextMedium20 from "../../components/Typography/TextMedium20";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  fetchFandoms,
  publishPost,
  uploadPostMedia,
} from "../../api/supabase_api";
import GlassContainer from "../../components/BackgroundContainers/GlassContainer";
import GenericFullScreenLoader from "../../components/Loaders/GenericFullScreenLoader";

const AddPost = () => {
  const { authUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [fandoms, setFandoms] = useState([]);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    content_text: "",
    music: "",
    location: "",
    fandom: authUser?.currentFandom || "",
    media: [],
    base64: [],
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => ({
        uri: asset.uri,
        base64: asset.base64,
      }));

      setForm((prevForm) => ({
        ...prevForm,
        media: [...prevForm.media, ...selectedImages.map((img) => img.uri)],
        base64: [
          ...prevForm.base64,
          ...selectedImages.map((img) => img.base64),
        ],
      }));

      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleFandomSelect = (fandomName) => {
    setForm((prevForm) => ({
      ...prevForm,
      fandom: fandomName,
    }));
  };

  const submitChanges = async () => {
    if (!form.content_text) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setUploading(true);
      const mediaUpload = await uploadPostMedia(authUser, form, setUploading);

      const postData = {
        content: form.content_text,
        media: mediaUpload || [],
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
      // Assuming you're using React Navigation
      // Replace this with your navigation logic
      // navigation.navigate("Profile");
    } catch (error) {
      console.error("Error publishing post:", error);
      Alert.alert("Error", "Failed to publish post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const getAllFandoms = async () => {
      const fandomsList = await fetchFandoms();
      setFandoms(fandomsList);
    };

    getAllFandoms();
  }, []);

  if (uploading) <GenericFullScreenLoader />;

  return (
    <SafeAreaView className="flex-1">
      <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
        <View className="mt-10 w-screen p-4 flex-row items-center justify-between">
          <TouchableOpacity>
            <Image source={icons.backArrow} resizeMethod="contain" />
          </TouchableOpacity>
          <TextMedium20>New Post</TextMedium20>
        </View>

        <ScrollView>
          <View className="flex-col items-start w-screen p-4 h-full">
            <View className="flex-row">
              <TouchableOpacity
                className="w-24 h-24 border-[1px] border-white rounded-xl items-center justify-center m-4"
                onPress={pickImage}
              >
                <AntDesign name="pluscircle" size={40} color="#8F29FD" />
              </TouchableOpacity>
              <ScrollView horizontal className="flex-row">
                {images.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img.uri }}
                    className="w-24 h-24 border-[1px] border-white rounded-xl m-4"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
            <View className="flex-1 text-white font-mregular text-base w-full">
              <TextInput
                className="flex-1 text-white font-mregular mt-5 p-4 text-base w-full items-start justify-start"
                editable
                multiline
                value={form.content_text}
                placeholder={"What do you have in mind?"}
                placeholderTextColor="#cdcde0"
                onChangeText={(text) =>
                  setForm({ ...form, content_text: text })
                }
              />
            </View>
            <View className="flex-1 w-full mt-20">
              <GlassContainer
                insideContainerClasses={
                  "flex-row items-center justify-between p-1"
                }
              >
                <Picker
                  selectedValue={form.fandom}
                  onValueChange={(itemValue) => handleFandomSelect(itemValue)}
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
            <View className="flex-1 text-white font-mregular text-base w-full border-b-2 border-b-slate-300">
              <TextInput
                className="flex-1 text-purple-400 font-mregular mt-5 p-4 text-base w-full items-start justify-start"
                editable
                multiline
                value={form.music}
                placeholder={"Add a link to your jam..."}
                placeholderTextColor="#cdcde0"
                onChangeText={(text) => setForm({ ...form, music: text })}
              />
            </View>
            <View className="flex-1 text-white font-mregular text-base w-full border-b-2 border-b-slate-300">
              <TextInput
                className="flex-1 text-purple-400 font-mregular mt-5 p-4 text-base w-full items-start justify-start"
                editable
                multiline
                value={form.location}
                placeholder={"Add a link to your location..."}
                placeholderTextColor="#cdcde0"
                onChangeText={(text) => setForm({ ...form, location: text })}
              />
            </View>
            <View className="w-full items-end mt-10 p-3">
              <SubmitButton
                label={"Publish Post"}
                extraClasses="w-[200px] h-[50px]"
                onPress={submitChanges}
              />
            </View>
          </View>
        </ScrollView>
      </BgDarkGradient>
    </SafeAreaView>
  );
};

export default AddPost;

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   TextInput,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { icons } from "../../constants";
// import { useAuth } from "../../context/AuthProvider";
// import * as ImagePicker from "expo-image-picker";
// import BgDarkGradient from "../../components/BackgroundGradients/BgDarkGradient";
// import SubmitButton from "../../components/Buttons/SubmitButton";
// import TextMedium20 from "../../components/Typography/TextMedium20";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import {
//   fetchFandoms,
//   publishPost,
//   uploadPostMedia,
// } from "../../api/supabase_api";
// import GlassContainer from "../../components/BackgroundContainers/GlassContainer";

// const AddPost = () => {
//   const { authUser } = useAuth();
//   const [uploading, setUploading] = useState(false);
//   const [editing, setEditing] = useState(true);
//   const [fandoms, setFandoms] = useState([]);
//   const [images, setImages] = useState([]);
//   const [form, setForm] = useState({
//     content_text: "" || null,
//     music: "" || null,
//     location: "" || null,
//     fandom: authUser?.currentFandom || "",
//     media: [] || null, // Updated to support multiple URIs
//     base64: [], // Updated to support multiple base64 strings
//   });

//   const pickImage = async () => {
//     // Request permission to access media library
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission Denied",
//         "We need camera roll permissions to make this work!"
//       );
//       return;
//     }

//     // Open image picker
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true, // Allow multiple image selection
//       base64: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const selectedImages = result.assets.map((asset) => ({
//         uri: asset.uri,
//         base64: asset.base64,
//       }));

//       // Update form media and base64 arrays
//       setForm({
//         ...form,
//         media: [...form.media, ...selectedImages.map((img) => img.uri)], // Append new URIs
//         base64: [...form.base64, ...selectedImages.map((img) => img.base64)], // Append new base64 strings
//       });

//       // Add images to state
//       setImages((prevImages) => [...prevImages, ...selectedImages]); // Append new images to existing state
//     }
//   };

//   const handleFandomSelect = (fandomName) => {
//     try {
//       // Update the selected fandom in the form state
//       setForm((prevForm) => ({
//         ...prevForm,
//         fandom: fandomName,
//       }));
//     } catch (error) {
//       console.error("Error choosing fandom:", error);
//       Alert.alert("Error", "Failed to choose fandom. Please try again.");
//       // Revert the form state if the update fails
//       setForm((prevForm) => ({
//         ...prevForm,
//         fandom: authUser?.currentFandom || "",
//       }));
//     }
//   };

//   const submitChanges = async () => {
//     if (!form.content_text || !form.fandom) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     try {
//       setUploading(true);
//       const mediaUpload = await uploadPostMedia(authUser, form, setUploading);

//       const postData = {
//         content: form.content_text,
//         media: mediaUpload || [],
//         user_id: authUser.userId,
//         post_location: form.location,
//         post_fandom_name: form.fandom,
//         post_song: form.music,
//       };

//       const post = await publishPost(postData);

//       if (!post.success) {
//         throw new Error(post.message);
//       }

//       Alert.alert("Success", "Post published successfully");
//       router.push("/profile");
//     } catch (error) {
//       console.error("Error publishing post:", error);
//       Alert.alert("Error", "Failed to publish post. Please try again.");
//     } finally {
//       setEditing(false);
//       setUploading(false);
//     }
//   };

//   useEffect(() => {
//     const getAllFandoms = async () => {
//       const fandomsList = await fetchFandoms();
//       setFandoms(fandomsList);
//     };

//     getAllFandoms();
//   }, []);

//   return (
//     <SafeAreaView className="flex-1">
//       <BgDarkGradient linearGradientMarginTop={"-mt-5"}>
//         <View className="mt-10 w-screen p-4 flex-row items-center justify-between">
//           <TouchableOpacity>
//             <Image source={icons.backArrow} resizeMethod="contain" />
//           </TouchableOpacity>
//           <TextMedium20>New Post</TextMedium20>
//         </View>

//         <ScrollView>
//           <View className="flex-col items-start w-screen p-4 h-full">
//             <View className="flex-row">
//               <TouchableOpacity
//                 className="w-24 h-24 border-[1px] border-white rounded-xl items-center justify-center m-4"
//                 onPress={pickImage}
//               >
//                 <AntDesign name="pluscircle" size={40} color="#8F29FD" />
//               </TouchableOpacity>
//               <ScrollView horizontal className="flex-row">
//                 {images.map((img, index) => (
//                   <Image
//                     key={index}
//                     source={{ uri: img.uri }}
//                     className="w-24 h-24 border-[1px] border-white rounded-xl m-4"
//                     resizeMode="cover"
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//             <View className="flex-1 text-white font-mregular text-base w-full">
//               <TextInput
//                 className="flex-1 text-white font-mregular mt-5 p-4 text-base w-full items-start justify-start"
//                 editable
//                 multiline
//                 value={form.content_text}
//                 placeholder={"What do you have in mind?"}
//                 placeholderTextColor="#cdcde0"
//                 onChangeText={(text) =>
//                   setForm({ ...form, content_text: text })
//                 }
//               />
//             </View>
//             <View className="flex-1 w-full mt-20">
//               <GlassContainer
//                 insideContainerClasses={
//                   "flex-row items-center justify-between p-1"
//                 }
//               >
//                 <Picker
//                   selectedValue={form.fandom}
//                   onValueChange={(itemValue) => handleFandomSelect(itemValue)}
//                   style={{ width: "100%", color: "white" }}
//                 >
//                   <Picker.Item label="Select a Fandom" value="None" />
//                   {fandoms.map((fandom) => (
//                     <Picker.Item
//                       key={fandom.fandom_id}
//                       label={fandom.fandom_name}
//                       value={fandom.fandom_name}
//                     />
//                   ))}
//                 </Picker>
//               </GlassContainer>
//             </View>
//             <View className="flex-1 text-white font-mregular text-base w-full border-b-2 border-b-slate-300">
//               <TextInput
//                 className="flex-1 text-purple-400 font-mregular mt-5 p-4 text-base w-full items-start justify-start"
//                 editable
//                 multiline
//                 value={form.music}
//                 placeholder={"Add a link to your jam..."}
//                 placeholderTextColor="#cdcde0"
//                 onChangeText={(text) => setForm({ ...form, music: text })}
//               />
//             </View>
//             <View className="flex-1 text-white font-mregular text-base w-full border-b-2 border-b-slate-300">
//               <TextInput
//                 className="flex-1 text-purple-400 font-mregular mt-5 p-4 text-base w-full items-start justify-start"
//                 editable
//                 multiline
//                 value={form.location}
//                 placeholder={"Add a link to your location..."}
//                 placeholderTextColor="#cdcde0"
//                 onChangeText={(text) => setForm({ ...form, location: text })}
//               />
//             </View>
//             <TouchableOpacity
//               onPress={submitChanges}
//               className="w-full items-end mt-10 p-3"
//             >
//               <SubmitButton
//                 label={"Publish Post"}
//                 extraClasses="w-[200px] h-[50px]"
//               />
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </BgDarkGradient>
//     </SafeAreaView>
//   );
// };

// export default AddPost;

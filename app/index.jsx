import { StatusBar } from "expo-status-bar";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { images } from "../constants";

export default function App() {
  return (
    <SafeAreaView
      className="h-full flex-1 relative items-center justify-center"
      style={styles.background}
    >
      <Image source={images.welcomePNG} className="w-screen h-screen" />

      <Image source={images.welcomeLogo} className="absolute" />

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgb(5,0,33)",
    backgroundImage:
      "linear-gradient(90deg, rgba(5,0,33,1) 0%, rgba(10,0,72,1) 54%, rgba(5,0,33,1) 100%);",
  },
});

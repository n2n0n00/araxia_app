import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SocialButton = ({ extraClasses, button, route, alt, onPress }) => {
  return (
    <View className={`${extraClasses}`}>
      <Link href={route}>
        <TouchableOpacity onPress={onPress}>
          <Image source={button} resizeMode="contain" alt={alt} />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  touchable: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
});

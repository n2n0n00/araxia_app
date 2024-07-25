import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import TextBold18 from "../Typography/TextBold18";

const EnterGameTicket = ({
  userId,
  artistId,
  concertTicketId,
  experienceId,
  gameCompleted,
}) => {
  const seeTicket = () => {
    router.push(
      `/view_ticket/${userId}/${artistId}/${experienceId}/${concertTicketId}`
    );
  };

  const enterGame = () => {
    router.push(`/enter_game/${userId}/${artistId}/${experienceId}`);
  };
  return (
    <View className="flex-row items-center justify-around w-[350px] bg-[#30B283] h-[80px] rounded-full mt-8">
      <TouchableOpacity onPress={seeTicket}>
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={["rgba(48,178,131,1)", "rgba(173,218,78,1)"]}
          locations={["0", "1"]}
          className="w-[150px] h-[60px] rounded-full items-center justify-center"
        >
          <TextBold18>See Ticket</TextBold18>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={enterGame}
        disabled={gameCompleted === true ? true : false}
      >
        {gameCompleted === true ? (
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={["rgba(181,181,181,1)", "rgba(139,139,139,1)"]}
            locations={["0", "1"]}
            className="w-[150px] h-[60px] rounded-full items-center justify-center"
          >
            <TextBold18>Enter Game</TextBold18>
          </LinearGradient>
        ) : (
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={["rgba(173,218,78,1)", "rgba(48,178,131,1)"]}
            locations={["0", "1"]}
            className="w-[150px] h-[60px] rounded-full items-center justify-center"
          >
            <TextBold18>Enter Game</TextBold18>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EnterGameTicket;

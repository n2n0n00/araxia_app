import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import MenuGlassContainer from "../../components/BackgroundContainers/MenuGlassContainer";
import { icons } from "../../constants";

const TabIcon = ({ icon, focused, focusedIcon }) => {
  return (
    <View className="items-center justify-center gap-2">
      {focused ? (
        <Image
          source={focusedIcon}
          resizeMode="contain"
          className="h-14 w-14"
        />
      ) : (
        <Image source={icon} resizeMode="contain" className="h-14 w-14" />
      )}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarBackground: () => <MenuGlassContainer />,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="tickets"
        options={{
          title: "Tickets",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focusedIcon={icons.ticketsPressed}
              icon={icons.tickets}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focusedIcon={icons.marketplacePressed}
              icon={icons.marketplace}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focusedIcon={icons.searchPressed}
              icon={icons.search}
              name="Search"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focusedIcon={icons.feedPressed}
              icon={icons.feed}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focusedIcon={icons.profileSelected}
              icon={icons.profile}
              name="Tickets"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

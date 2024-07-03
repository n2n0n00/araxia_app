import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import React from "react";

const TabIcon = ({ icon, color, name, focused, focusedIcon }) => {
  return (
    <View className="items-center justify-center gap-2">
      {focused ? (
        <Image source={focusedIcon} resizeMode="contain" className="h-6 w-6" />
      ) : (
        <Image source={icon} resizeMode="contain" className="h-6 w-6" />
      )}

      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ffa001",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0.5,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: "Feed",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // focusedIcon={icons.feedSelected}
                // icon={icons.feed}
                // color={white}
                name="Feed"
                // focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="marketplace"
          options={{
            title: "Marketplace",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // focusedIcon={icons.messagesSelected}
                // icon={icons.messages}
                // color={color}
                name="Marketplace"
                // focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // focusedIcon={icons.friendsSelected}
                // icon={icons.friends}
                // color={color}
                name="Profile"
                // focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: "Tickets",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // focusedIcon={icons.profileSelected}
                // icon={icons.profile}
                // color={color}
                name="Tickets"
                // focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                // focusedIcon={icons.profileSelected}
                // icon={icons.profile}
                // color={color}
                name="Search"
                // focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

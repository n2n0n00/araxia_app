import React from "react";
import { View, FlatList } from "react-native";

const TopUsers = (topArtists) => {
  return (
    <View className="flex-1 relative">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={topArtists}
        keyExtractor={(item) => item.topArtistsRecentExperience.artist_id}
        renderItem={({ item }) => (
          <TopArtistsMarketplaceCard
            artistId={item.topArtistsRecentExperience.artist_id}
            experienceId={item.topArtistsRecentExperience.experience_id}
            banner={item.topArtistsRecentExperience.experience_banner}
            content={item.topArtistsRecentExperience.experience_description}
            artistName={item.topArtistsRecentExperience.artist_name}
            avatar={item.topArtistsRecentExperience.artist_avatar}
            price={item.topArtistsRecentExperience.experience_price}
            expCurrency={item.topArtistsRecentExperience.experience_currency}
            // getExpLink={item.expLink}
            expCity={item.topArtistsRecentExperience.experience_city}
            expCountry={item.topArtistsRecentExperience.experience_country}
            date={item.topArtistsRecentExperience.experience_starts_at}
            expName={item.topArtistsRecentExperience.expeirence_name}
          />
        )}
        // ListEmptyComponent={() => (
        //   <EmptyState
        //     title="No Experiences Found"
        //     subtitle="Get Your First Experience At The Marketplace"
        //   />
        // )}
      />
    </View>
  );
};

export default TopUsers;

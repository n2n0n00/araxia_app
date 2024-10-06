import { supabase } from "../supabase";

export const getUserLatestCompletedExperience = async (userId) => {};

export const getExperienceLocations = async () => {
  const { data, error } = await supabase
    .from("experiencesDatabase")
    .select("experience_city, experience_country, experience_id");

  if (error) {
    console.error("Error fetching experiences:", error);
    return []; // Always return an array, even in case of error
  }

  // Filter out duplicate city-country combinations
  const uniqueLocations = data.filter(
    (v, i, a) =>
      a.findIndex(
        (t) =>
          t.experience_city === v.experience_city &&
          t.experience_country === v.experience_country
      ) === i
  );

  return uniqueLocations; // Make sure this is always an array
};

export const fetchLeaderboardData = async (
  preferredLocation,
  preferredFandom
) => {
  // Step 1: Fetch experience_ids based on preferred locations
  let { data: experiences, error: experienceError } = await supabase
    .from("experiencesDatabase") // Make sure this matches your actual table name
    .select("experience_id")
    .in("experience_city", preferredLocation); // Matches any city in the array

  if (experienceError) {
    console.error("Error fetching experiences:", experienceError);
    return [];
  }

  // If no experiences are found, return early
  if (!experiences || experiences.length === 0) {
    console.log("No experiences found for the given locations.");
    return [];
  }

  const experienceIds = experiences.map((exp) => exp.experience_id);

  // Step 2: Fetch leaderboard ranks based on experience_ids and preferred fandoms
  let { data: leaderboardRanks, error: leaderboardError } = await supabase
    .from("leaderboardRanks") // Make sure this matches your actual table name
    .select("*")
    .in("experience_id", experienceIds) // Filter by the fetched experience_ids
    .in("fandom_id", preferredFandom); // Matches any fandom in the array

  if (leaderboardError) {
    console.error("Error fetching leaderboard ranks:", leaderboardError);
    return [];
  }

  return leaderboardRanks; // Return the fetched leaderboard data
};

// export const fetchLeaderboardData = async (
//   preferredLocations,
//   preferredFandoms
// ) => {
//   try {
//     // Step 1: Get Experience IDs Based on City
//     let { data: experienceData, error: experienceError } = await supabase
//       .from("experiencesDatabase")
//       .select("experience_id")
//       .in("experience_city", preferredLocations);

//     if (experienceError) {
//       throw new Error(
//         `Error fetching experience IDs: ${experienceError.message}`
//       );
//     }

//     // Extract experience IDs
//     const experienceIds = experienceData.map((exp) => exp.experience_id);

//     // Step 2: Get Leaderboard Data Based on Experience IDs and Fandom IDs
//     let { data: leaderboardRanks, error: leaderboardError } = await supabase
//       .from("leaderboardRanks")
//       .select(
//         `
//         user_id,
//         experience_id,
//         user_xp,
//         user_friends,
//         user_rank,
//         experiencesDatabase (experience_name, experience_city, experience_country, artist_name, artist_avatar)
//       `
//       )
//       .in("experience_id", experienceIds) // Filters by the experience IDs obtained
//       .in("fandom_id", preferredFandoms); // Filters by the preferred fandom IDs

//     if (leaderboardError) {
//       throw new Error(
//         `Error fetching leaderboard data: ${leaderboardError.message}`
//       );
//     }

//     return leaderboardRanks; // Return the fetched leaderboard data
//   } catch (error) {
//     console.error(error);
//     return null; // Return null in case of error
//   }
// };

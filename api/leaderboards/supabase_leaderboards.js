import { supabase } from "../supabase";

export const getUserLatestCompletedExperience = async (userId) => {};

export const getExperienceLocations = async () => {
  const { data, error } = await supabase
    .from("experiencesDatabase")
    .select("experience_city, experience_country, experience_id");

  if (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }

  const uniqueLocations = data.filter(
    (v, i, a) =>
      a.findIndex(
        (t) =>
          t.experience_city === v.experience_city &&
          t.experience_country === v.experience_country
      ) === i
  );

  return uniqueLocations;
};

export const fetchLeaderboardData = async (
  preferredLocations,
  preferredFandoms
) => {
  try {
    if (!Array.isArray(preferredLocations) || preferredLocations.length === 0) {
      throw new Error("preferredLocations must be a non-empty array");
    }
    if (!Array.isArray(preferredFandoms) || preferredFandoms.length === 0) {
      throw new Error("preferredFandoms must be a non-empty array");
    }

    // First query: Get experience IDs
    const { data: experiences, error: experienceError } = await supabase
      .from("experiencesDatabase")
      .select("experience_id")
      .in("experience_city", preferredLocations);

    if (experienceError) {
      console.error("Error fetching experiences:", experienceError);
      throw new Error("Failed to fetch experiences");
    }

    if (!experiences || experiences.length === 0) {
      return {
        data: [],
        message: "No experiences found for the given locations",
        metadata: {
          queriedLocations: preferredLocations,
          queriedFandoms: preferredFandoms,
        },
      };
    }

    // Extract experience IDs
    const experienceIds = experiences.map((exp) => exp.experience_id);

    // Second query: Get leaderboard ranks, now with sorting
    const { data: leaderboardRanks, error: leaderboardError } = await supabase
      .from("leaderboardRanks")
      .select(
        `
        *,
        experience:experiencesDatabase!inner(
          experience_id,
          experience_city,
          experience_name
        )
      `
      )
      .in("experience_id", experienceIds)
      .in("fandom_id", preferredFandoms)
      .order("user_rank", { ascending: true }); // Add this line for sorting

    if (leaderboardError) {
      console.error("Error fetching leaderboard ranks:", leaderboardError);
      throw new Error("Failed to fetch leaderboard data");
    }

    // Group leaderboardRanks by experience_id
    const groupedByExperience = leaderboardRanks.reduce((acc, item) => {
      const experienceId = item.experience.experience_id;
      if (!acc[experienceId]) {
        acc[experienceId] = [];
      }
      acc[experienceId].push(item);
      return acc;
    }, {});

    return {
      data: groupedByExperience,
      metadata: {
        experienceCount: experienceIds.length,
        resultCount: leaderboardRanks?.length || 0,
        queriedLocations: preferredLocations,
        queriedFandoms: preferredFandoms,
      },
    };
  } catch (error) {
    console.error("Error in fetchLeaderboardData:", error.message);
    return {
      data: [],
      error: error.message,
      metadata: {
        queriedLocations: preferredLocations || [],
        queriedFandoms: preferredFandoms || [],
      },
    };
  }
};

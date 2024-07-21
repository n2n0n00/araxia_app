import { supabase } from "../supabase";

export const searchUserDatabaseUser = async (query) => {
  if (!query) {
    console.warn("Query string is empty");
    return [];
  }

  try {
    const { error: tableError } = await supabase
      .from("userDatabase")
      .select("*")
      .limit(1);

    if (tableError) {
      if (
        tableError.message.includes(
          'relation "public.userDatabase" does not exist'
        )
      ) {
        console.warn("Table userDatabase does not exist");
        return [];
      }
      throw new Error(tableError.message);
    }

    const formattedQuery = query.split(" ").join(" & ");

    const { data: searchResult, error: queryError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("isUserArtist", false)
      .textSearch("username", formattedQuery, {
        type: "websearch",
        config: "english",
      });

    if (queryError) {
      console.error(
        "Error fetching query results from userDatabase:",
        queryError
      );
      throw new Error(queryError.message);
    }

    return searchResult || [];
  } catch (error) {
    console.error("Error in searchUserDatabaseUser:", error);
    throw new Error(error.message);
  }
};

export const searchUserDatabaseArtist = async (query) => {
  if (!query) {
    console.warn("Query string is empty");
    return [];
  }

  try {
    const { error: tableError } = await supabase
      .from("userDatabase")
      .select("*")
      .limit(1);

    if (tableError) {
      if (
        tableError.message.includes(
          'relation "public.userDatabase" does not exist'
        )
      ) {
        console.warn("Table userDatabase does not exist");
        return [];
      }
      throw new Error(tableError.message);
    }

    const formattedQuery = query.split(" ").join(" & ");

    const { data: searchResult, error: queryError } = await supabase
      .from("userDatabase")
      .select("*")
      .eq("isUserArtist", true)
      .textSearch("artistName", formattedQuery, {
        type: "websearch",
        config: "english",
      });

    if (queryError) {
      console.error(
        "Error fetching query results from userDatabase:",
        queryError
      );
      throw new Error(queryError.message);
    }

    return searchResult || [];
  } catch (error) {
    console.error("Error in searchUserDatabaseArtist:", error);
    throw new Error(error.message);
  }
};

export const searchGlobalNFTs = async (query) => {
  if (!query) {
    console.warn("Query string is empty");
    return [];
  }

  try {
    const { error: tableError } = await supabase
      .from("globalNFTs")
      .select("*")
      .limit(1);

    if (tableError) {
      if (
        tableError.message.includes(
          'relation "public.globalNFTs" does not exist'
        )
      ) {
        console.warn("Table globalNFTs does not exist");
        return [];
      }
      throw new Error(tableError.message);
    }

    const formattedQuery = query.split(" ").join(" & ");

    const { data: searchResult, error: queryError } = await supabase
      .from("globalNFTs")
      .select("*")
      .or(`name.fts.${formattedQuery},description.fts.${formattedQuery}`);

    if (queryError) {
      console.error(
        "Error fetching query results from globalNFTs:",
        queryError
      );
      throw new Error(queryError.message);
    }

    return searchResult || [];
  } catch (error) {
    console.error("Error in searchGlobalNFTs:", error);
    if (error.message.includes('relation "public.globalNFTs" does not exist')) {
      console.warn("Table globalNFTs does not exist");
      return [];
    } else {
      throw error;
    }
  }
};

export const searchExperiencesDirectory = async (query) => {
  if (!query) {
    console.warn("Query string is empty");
    return [];
  }

  try {
    const { error: tableError } = await supabase
      .from("experiencesDatabase")
      .select("*")
      .limit(1);

    if (tableError) {
      if (
        tableError.message.includes(
          'relation "public.experiencesDatabase" does not exist'
        )
      ) {
        console.warn("Table experiencesDatabase does not exist");
        return [];
      }
      throw new Error(tableError.message);
    }

    const formattedQuery = query.split(" ").join(" & ");

    const { data: searchResult, error: queryError } = await supabase
      .from("experiencesDatabase")
      .select("*")
      .or(
        `experience_name.fts.${formattedQuery},artist_name.fts.${formattedQuery}`
      );

    if (queryError) {
      console.error(
        "Error fetching query results from experiencesDatabase:",
        queryError
      );
      throw new Error(queryError.message);
    }

    return searchResult || [];
  } catch (error) {
    console.error("Error in searchExperiencesDirectory:", error);
    throw new Error(error.message);
  }
};

export const searchAllTables = async (query, filter) => {
  try {
    let searchResults;

    switch (filter) {
      case "Artist":
        searchResults = await searchUserDatabaseArtist(query);
        break;
      case "User":
        searchResults = await searchUserDatabaseUser(query);
        break;
      case "NFT":
        searchResults = await searchGlobalNFTs(query);
        break;
      case "Experience":
        searchResults = await searchExperiencesDirectory(query);
        break;
      default:
        searchResults = [];
        break;
    }

    return searchResults;
  } catch (error) {
    console.error(
      `Error fetching search results for query "${query}" and filter "${filter}":`,
      error.message
    );
    throw new Error(error.message);
  }
};

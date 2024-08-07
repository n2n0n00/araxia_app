import { View, FlatList } from "react-native";
import React from "react";
import TextMedium18 from "../../components/Typography/TextMedium18";
import ExperienceCertCard from "../Cards/ExperienceCertCard";

const ExperiencesPosts = ({ experiences, authUser }) => {
  return (
    <View className="mt-5 mb-10 items-center">
      <FlatList
        data={experiences}
        renderItem={({ item }) => (
          <ExperienceCertCard
            experienceId={item.experience_id}
            authUser={authUser}
          />
        )}
        keyExtractor={(item) => item.relationship_id.toString()}
        contentContainerStyle={{
          justifyContent: "center",
          paddingTop: 10,
        }}
        ListEmptyComponent={() => (
          <TextMedium18>No Experiences here yet...</TextMedium18>
        )}
      />
    </View>
  );
};

export default ExperiencesPosts;

// import { View, FlatList } from "react-native";
// import React from "react";
// import { dataAltPosts } from "../../constants/constants";
// import TextMedium18 from "../../components/Typography/TextMedium18";
// import { useState } from "react";
// import ExperienceCertCard from "../Cards/ExperienceCertCard";
// import {
//   getExperienceById,
//   getUserSubscribedExperiencesData,
// } from "../../api/supabase_api";

// const ExperiencesPosts = (experiences, authUser) => {
//   return (
//     <View className="mt-5 mb-10 items-center">
//       <FlatList
//         data={experiences}
//         renderItem={({ item }) => (
//           <ExperienceCertCard
//             experinceId={item.experienceId}
//             authUser={authUser}
//           />
//         )}
//         keyExtractor={(item) => item.relationship_id}
//         contentContainerStyle={{
//           justifyContent: "center",
//           paddingTop: 10,
//         }}
//         ListEmptyComponent={() => (
//           <TextMedium18>No Experiences here yet...</TextMedium18>
//         )}
//       />
//     </View>
//   );
// };

// export default ExperiencesPosts;

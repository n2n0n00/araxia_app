export const transformLeaderboardData = (data) => {
  return data.flatMap((experienceObj) => {
    const experienceId = Object.keys(experienceObj)[0];
    return experienceObj[experienceId].map((rank) => ({
      ...rank,
      experienceId,
    }));
  });
};

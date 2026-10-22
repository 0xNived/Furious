export const ACTIVITY_XP = 5;
export const ACTIVITY_COOLDOWN_SECONDS = 60;

export function getLevelProgress(totalXp) {
  const level = Math.floor(Math.sqrt(totalXp / 15)) + 1;
  const levelStartXp = 15 * (level - 1) ** 2;
  const nextLevelXp = 15 * level ** 2;
  const currentXp = totalXp - levelStartXp;
  const neededXp = nextLevelXp - levelStartXp;

  return {
    level,
    currentXp,
    neededXp,
    percentage: Math.floor((currentXp / neededXp) * 100),
  };
}

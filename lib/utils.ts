// lib/utils.ts

// Format: 00:00
export const formatColonTime = (seconds: number): string => {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Format: 3 mins 23 secs (Your current player logic)
export const formatWordsTime = (seconds: number): string => {
  if (!seconds) return "0 mins 0 secs";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins} mins ${secs} secs`;
};
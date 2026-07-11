// helper to generate a random hex color
export const getRandomColor = () =>
  "#" +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");

// helper for readable names
const adjectives = ["swift", "bold", "brave", "calm", "quick"];
const nouns = ["scout", "soldier", "sniper", "tank", "pilot"];

export const getRandomName = () =>
  `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}-${Math.floor(Math.random() * 100)}`;

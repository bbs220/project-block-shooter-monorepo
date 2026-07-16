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

// Define safe coordinates on opposite sides of your map
const RED_SPAWNS = [
  { x: -20, z: -20 },
  { x: -22, z: -18 },
  { x: -18, z: -22 },
  { x: -20, z: -18 },
];

const BLUE_SPAWNS = [
  { x: 20, z: 20 },
  { x: 22, z: 18 },
  { x: 18, z: 22 },
  { x: 20, z: 18 },
];

// Helper function to grab a random spawn
export function getRandomSpawn(team: "red" | "blue") {
  const spawns = team === "red" ? RED_SPAWNS : BLUE_SPAWNS;
  return spawns[Math.floor(Math.random() * spawns.length)];
}

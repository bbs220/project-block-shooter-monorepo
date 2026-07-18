import { Html } from "@react-three/drei";
import type { PlayerState } from "../../stores/useGameStore";

export default function PlayerLabel({ player }: { player: PlayerState }) {
  return (
    <Html position={[0, 2.8, 0]} center transform sprite>
      <div className="flex flex-col items-center pointer-events-none select-none w-24">
        {/* player name with a drop shadow for visibility */}
        <span className="text-white text-xs font-bold drop-shadow-md mb-1 whitespace-nowrap">
          {player.name}
        </span>

        {/* health bar container */}
        <div className="w-full h-2 bg-gray-900 rounded overflow-hidden border border-gray-700">
          {/* dynamic health fill */}
          <div
            className="h-full bg-green-500 transition-all duration-200 ease-out"
            style={{
              width: `${Math.max(0, player.health)}%`,
              // change color to red if health is low
              backgroundColor: player.health <= 25 ? "#ef4444" : "#22c55e",
            }}
          />
        </div>
      </div>
    </Html>
  );
}

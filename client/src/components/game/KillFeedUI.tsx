import { useEffect } from "react";
import { useGameStore } from "../../stores/useGameStore";
import {
  iconAssaultRifle,
  iconBurstRifle,
  iconPistol,
} from "../../utils/assetPaths";

// helper to map the server's weapon name to the UI icon
const getKillFeedIcon = (weaponName: string) => {
  const name = weaponName.toLowerCase();
  if (name.includes("burst")) return iconBurstRifle;
  if (name.includes("pistol")) return iconPistol;
  return iconAssaultRifle;
};

const KillFeedUI = () => {
  const killFeed = useGameStore((state) => state.killFeed);
  const removeOldKills = useGameStore((state) => state.removeOldKills);

  useEffect(() => {
    const interval = setInterval(() => {
      removeOldKills();
    }, 1000);
    return () => clearInterval(interval);
  }, [removeOldKills]);

  if (killFeed.length === 0) return null;

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-40 pointer-events-none items-end">
      {killFeed.map((kill) => (
        <div
          key={kill.id}
          className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-lg text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300"
        >
          {/* Shooter Name */}
          <span
            className={
              kill.shooterTeam === "red" ? "text-red-400" : "text-blue-400"
            }
          >
            {kill.shooter}
          </span>

          {/* Weapon Icon (Replacing the text) */}
          <img
            src={getKillFeedIcon(kill.weapon)}
            alt={kill.weapon}
            className="h-4 object-contain mx-2 opacity-80"
          />

          {/* Target Name */}
          <span
            className={
              kill.targetTeam === "red" ? "text-red-400" : "text-blue-400"
            }
          >
            {kill.target}
          </span>
        </div>
      ))}
    </div>
  );
};

export default KillFeedUI;

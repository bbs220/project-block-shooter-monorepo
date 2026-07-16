import { useEffect } from "react";
import { useGameStore } from "../../stores/useGameStore";

const KillFeedUI = () => {
  const killFeed = useGameStore((state) => state.killFeed);
  const removeOldKills = useGameStore((state) => state.removeOldKills);

  // Self-cleaning garbage collector (runs every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      removeOldKills();
    }, 1000);
    return () => clearInterval(interval);
  }, [removeOldKills]);

  // Don't render anything if there are no recent kills
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

          {/* Weapon Used */}
          <span className="text-neutral-400 text-xs uppercase tracking-wider mx-1">
            [{kill.weapon}]
          </span>

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

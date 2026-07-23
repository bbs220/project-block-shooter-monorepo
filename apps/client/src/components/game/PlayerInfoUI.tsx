import { InfinityIcon } from "lucide-react";
import { WEAPONS } from "@block-shooter/shared";
import { iconBank } from "../../utils/assetPaths";
import { useGameStore } from "../../stores/useGameStore";

// helper to grab the right image based on the weapon key
const getWeaponIcon = (weaponKey: string) => {
  if (weaponKey === "burstRifle") return iconBank.burstRifle;
  if (weaponKey === "pistol") return iconBank.pistol;
  return iconBank.assaultRifle;
};

const PlayerInfoUI = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  const me = localId ? players[localId] : null;

  // Don't render anything if the local player isn't loaded yet
  if (!me) return null;

  // Prevent health from showing negative values if we take overkill damage
  const displayHealth = Math.max(0, me.health);

  // Dynamically change health bar color based on how low it is
  const healthColor =
    displayHealth > 50
      ? "bg-green-500"
      : displayHealth > 25
        ? "bg-yellow-500"
        : "bg-red-600";

  return (
    // 'bottom-6 left-1/2 -translate-x-1/2' perfectly centers it at the bottom of the screen!
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 z-10 pointer-events-none">
      <div className="flex flex-col items-start gap-3 bg-black/50 p-4 rounded-xl backdrop-blur-md shadow-lg w-fit border border-white/10 min-w-75">
        {/* Top Row: Player Identity & Health Bar */}
        <div className="flex flex-col gap-2 w-full border-b border-gray-600/50 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: me.color }}
            />
            <span className="text-white font-bold text-lg drop-shadow-md">
              {me.name}
            </span>
          </div>

          {/* NEW: Dynamic Health Bar */}
          <div className="w-full bg-gray-900 border border-gray-700 rounded-sm h-5 relative overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-200 ease-out ${healthColor}`}
              style={{ width: `${displayHealth}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black tracking-widest text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
              {displayHealth} HP
            </span>
          </div>
        </div>

        {/* Middle Row: Weapon Status & Icon */}
        <div className="flex items-end gap-4 w-full pt-1">
          <img
            src={getWeaponIcon(me.currentWeapon)}
            alt="Weapon Icon"
            className="h-8 object-contain opacity-90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          />

          <span className="text-xl font-bold uppercase tracking-wider text-gray-200">
            {WEAPONS[me.currentWeapon].name}
          </span>

          <span className="text-3xl font-black leading-none text-white drop-shadow-sm flex items-baseline tabular-nums ml-auto">
            {String(me.ammo).padStart(2, "0")}
            <span className="text-gray-400 text-lg font-bold mx-1">
              / {String(WEAPONS[me.currentWeapon].magSize).padStart(2, "0")}
            </span>
            <span
              className="text-gray-500 text-2xl font-bold ml-2 leading-none"
              title="Infinite Reserve"
            >
              <InfinityIcon size={24} />
            </span>
          </span>
        </div>

        {/* Bottom Row: Controls & Reload Status */}
        <div className="mt-2 text-xs font-mono flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 flex items-center">
              <kbd className="bg-gray-800 border border-gray-600 px-1.5 py-0.5 rounded text-white shadow-sm mr-1">
                1
              </kbd>
              Rifle
            </span>
            <span className="text-gray-300 flex items-center">
              <kbd className="bg-gray-800 border border-gray-600 px-1.5 py-0.5 rounded text-white shadow-sm mr-1">
                2
              </kbd>
              Pistol
            </span>
            <span className="text-gray-300 flex items-center">
              <kbd className="bg-gray-800 border border-gray-600 px-1.5 py-0.5 rounded text-white shadow-sm mr-1">
                3
              </kbd>
              Burst
            </span>
          </div>

          <span
            className={`flex items-center transition-colors duration-200 font-bold tracking-wider ${me.isReloading ? "text-yellow-400" : "text-gray-600"}`}
          >
            <kbd
              className={`px-1.5 py-0.5 rounded shadow-sm mr-2 border transition-colors duration-200 ${me.isReloading ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "bg-gray-800/50 border-gray-700 text-gray-600"}`}
            >
              R
            </kbd>
            RELOADING
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoUI;

import { useGameStore } from "../../stores/useGameStore";
import { WEAPONS } from "@block-shooter/shared";
import { iconBank } from "../../utils/assetPaths";

const getWeaponIcon = (weaponKey: string) => {
  if (weaponKey === "burstRifle") return iconBank.burstRifle;
  if (weaponKey === "pistol") return iconBank.pistol;
  return iconBank.assaultRifle;
};

const LOADOUT = [
  { id: "assaultRifle", keybind: "1" },
  { id: "pistol", keybind: "2" },
  { id: "burstRifle", keybind: "3" },
];

const PlayerInfoUI = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  const me = localId ? players[localId] : null;

  if (!me) return null;

  const displayHealth = Math.max(0, me.health);
  const maxHealth = 100;
  const healthSegments = 10;

  return (
    // Reduced padding from p-10 to p-6 to push it closer to the screen edges
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-end z-10">
      <div className="flex justify-between items-end w-full">
        {/* ========================================== */}
        {/* BOTTOM LEFT: Health & Name                 */}
        {/* ========================================== */}
        <div className="flex flex-col gap-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-black text-white tracking-wide">
              {me.name}
            </span>
            <span
              className="w-3 h-3 rounded-full border-2 border-white/50"
              style={{ backgroundColor: me.color }}
            />
          </div>

          <div className="flex items-end gap-3">
            {/* Big Health Number (Scaled down from 6xl to 5xl) */}
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black tabular-nums leading-none tracking-tighter">
                {displayHealth}
              </span>
              <span className="text-xl font-bold text-gray-300">
                / {maxHealth}
              </span>
            </div>

            {/* Segmented Health Bar */}
            <div className="flex gap-1 mb-1.5">
              {Array.from({ length: healthSegments }).map((_, i) => {
                const isActive =
                  i * (maxHealth / healthSegments) < displayHealth;
                const isLowHealth = displayHealth <= 30;

                return (
                  <div
                    key={i}
                    className={`h-5 w-5 transform -skew-x-12 border-b-4 border-black/40 transition-colors duration-200 ${
                      isActive
                        ? isLowHealth
                          ? "bg-red-500 shadow-[0_0_8px_red]"
                          : "bg-white shadow-[0_0_6px_white]"
                        : "bg-black/40"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* BOTTOM RIGHT: Weapon Stack & Ammo          */}
        {/* ========================================== */}
        <div className="flex flex-col items-end gap-1.5 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          {LOADOUT.map((wpn) => {
            const isActive = me.currentWeapon === wpn.id;
            // Determine if THIS specific weapon is currently being reloaded
            const isReloadingActiveWeapon = isActive && me.isReloading;

            return (
              <div
                key={wpn.id}
                className={`flex items-center gap-3 transition-all duration-300 ease-out origin-right ${
                  isActive
                    ? "scale-100 translate-x-0"
                    : "opacity-40 scale-75 translate-x-4"
                } ${isReloadingActiveWeapon ? "opacity-40 animate-pulse" : isActive ? "opacity-100" : ""}`}
              >
                {/* Inline Ammo (Only renders for the active weapon to keep UI clean) */}
                {isActive && (
                  <div className="flex items-baseline gap-1 mr-2 text-white">
                    <span className="text-4xl font-black tabular-nums tracking-tighter leading-none">
                      {String(me.ammo).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-bold text-gray-400 tabular-nums">
                      / {String(WEAPONS[wpn.id].magSize).padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* Weapon Name & Keybind */}
                <div className="flex flex-col items-end justify-center">
                  <span className="text-[10px] text-gray-300 font-bold bg-black/50 px-1 rounded-sm mb-0.5">
                    [{wpn.keybind}]
                  </span>
                  <span
                    className={`uppercase font-black tracking-wider ${
                      isActive ? "text-lg text-white" : "text-xs text-gray-400"
                    }`}
                  >
                    {WEAPONS[wpn.id].name}
                  </span>
                </div>

                {/* Weapon Icon (Scaled down from h-16 to h-12) */}
                <img
                  src={getWeaponIcon(wpn.id)}
                  alt={wpn.id}
                  className={`object-contain transition-all duration-300 ${
                    isActive
                      ? "h-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      : "h-8"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoUI;

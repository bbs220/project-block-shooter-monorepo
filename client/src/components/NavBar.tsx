import { InfinityIcon } from "lucide-react";
import { useGameStore } from "../stores/useGameStore";
import { WEAPONS } from "../utils/weapons";

const NavBar = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  // find the current player's data from the store
  const me = localId ? players[localId] : null;

  return (
    // Anchor everything to the top-left to leave the right side completely free for Tweakpane
    <nav className="absolute top-0 left-0 p-6 z-10 pointer-events-none">
      {me ? (
        // Single unified HUD container
        <div className="flex flex-col items-start gap-3 bg-black/50 p-4 rounded-xl backdrop-blur-md shadow-lg w-fit border border-white/10">
          {/* Top Row: Player Identity */}
          <div className="flex items-center gap-3 w-full border-b border-gray-600/50 pb-3">
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: me.color }}
            />
            <span className="text-white font-bold text-lg drop-shadow-md">
              {me.name}
            </span>
          </div>

          {/* Middle Row: Weapon Status */}
          <div className="flex items-end gap-4 w-full pt-1">
            <span className="text-xl font-bold uppercase tracking-wider text-gray-200">
              {WEAPONS[me.currentWeapon].name}
            </span>

            {/* Added tabular-nums to force equal width for all digits */}
            <span className="text-3xl font-black leading-none text-white drop-shadow-sm flex items-baseline tabular-nums">
              {/* Pad current ammo with a leading zero */}
              {String(me.ammo).padStart(2, "0")}

              <span className="text-gray-400 text-lg font-bold mx-1">
                {/* Pad max ammo with a leading zero */}/{" "}
                {String(WEAPONS[me.currentWeapon].magSize).padStart(2, "0")}
              </span>

              {/* Reserve ammo indicator */}
              <span
                className="text-gray-500 text-2xl font-bold ml-2 leading-none"
                title="Infinite Reserve"
              >
                <InfinityIcon />
              </span>
            </span>
          </div>

          {/* Bottom Row: Controls & Reload Status */}
          <div className="mt-2 text-xs font-mono flex items-center gap-4">
            <span className="text-gray-300 flex items-center">
              <kbd className="bg-gray-800 border border-gray-600 px-1.5 py-0.5 rounded text-white shadow-sm mr-2">
                1
              </kbd>
              Rifle
            </span>

            <span className="text-gray-300 flex items-center">
              <kbd className="bg-gray-800 border border-gray-600 px-1.5 py-0.5 rounded text-white shadow-sm mr-2">
                2
              </kbd>
              Pistol
            </span>

            {/* newly added burst rifle hint */}
            <span className="text-gray-300 flex items-center">
              <kbd className="bg-gray-800 border border-gray-600 px-1.5 py-0.5 rounded text-white shadow-sm mr-2">
                3
              </kbd>
              Burst
            </span>

            {/* Dynamic Reload Indicator */}
            <span
              className={`flex items-center transition-colors duration-200 font-bold tracking-wider ${
                me.isReloading ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              <kbd
                className={`px-1.5 py-0.5 rounded shadow-sm mr-2 border transition-colors duration-200 ${
                  me.isReloading
                    ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                    : "bg-gray-800/50 border-gray-700 text-gray-600"
                }`}
              >
                R
              </kbd>
              RELOADING
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-black/50 px-5 py-3 rounded-xl backdrop-blur-md w-fit border border-white/10">
          <span className="text-white font-bold text-lg animate-pulse">
            Connecting...
          </span>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

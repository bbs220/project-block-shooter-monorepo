import useSound from "use-sound";
import { useGameStore } from "../../stores/useGameStore";
import { soundBank } from "../../utils/assetPaths";

const PlayButtonUI = () => {
  const isLocked = useGameStore((state) => state.isLocked);
  const matchState = useGameStore((state) => state.matchState);
  const [playClick] = useSound(soundBank.click, { volume: 0.5 });

  // hide if the player is actively playing, or if the match is over (showing final scoreboard)
  const isHidden = isLocked || matchState === "ended";

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-40 pointer-events-none transition-opacity duration-200 ${
        isHidden ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* the actual button that accepts clicks */}
      <button
        onClick={() => playClick()}
        id="play-button"
        className={`w-1/6 h-1/6 bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-bold tracking-widest uppercase rounded-xl transition-all shadow-xl ${
          isHidden
            ? "pointer-events-none"
            : "pointer-events-auto cursor-pointer"
        }`}
      >
        Play 🕹️
      </button>
    </div>
  );
};

export default PlayButtonUI;

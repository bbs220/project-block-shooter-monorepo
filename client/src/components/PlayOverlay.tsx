import { useGameStore } from "../stores/useGameStore";

const PlayOverlay = () => {
  const isLocked = useGameStore((state) => state.isLocked);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none transition-opacity duration-200 ${
        isLocked ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* the actual button that accepts clicks */}
      <button
        id="play-button"
        className={`w-1/6 h-1/6 bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-bold tracking-widest uppercase rounded-xl transition-all shadow-xl ${
          isLocked
            ? "pointer-events-none"
            : "pointer-events-auto cursor-pointer"
        }`}
      >
        Play 🕹️
      </button>
    </div>
  );
};

export default PlayOverlay;

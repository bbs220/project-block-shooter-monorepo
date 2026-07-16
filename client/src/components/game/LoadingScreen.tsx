import { useGameStore } from "../../stores/useGameStore";

const LoadingScreen = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);
  const me = localId ? players[localId] : null;

  // if we have player data, hide the loading screen
  if (me) return null;

  return (
    <div className="absolute inset-0 z-50 bg-neutral-900/95 backdrop-blur-sm flex items-center justify-center transition-opacity duration-600 ease-out">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-white font-black text-2xl tracking-widest uppercase">
          Connecting to Arena...
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;

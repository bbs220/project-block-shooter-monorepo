import { useGameStore } from "../stores/useGameStore";

const MatchTimerUI = () => {
  const matchState = useGameStore((state) => state.matchState);
  const timeRemaining = useGameStore((state) => state.timeRemaining);

  // format seconds into mm:ss
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 p-4 z-10 pointer-events-none">
      <div className="flex flex-col items-center bg-black/60 px-6 py-2 rounded-b-xl border-x border-b border-white/10 backdrop-blur-md shadow-lg">
        <span
          className={`text-sm font-bold tracking-widest uppercase mb-1 ${
            matchState === "playing" ? "text-green-400" : "text-red-400"
          }`}
        >
          {matchState}
        </span>

        <span className="text-4xl font-black text-white drop-shadow-md tabular-nums leading-none">
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
};

export default MatchTimerUI;

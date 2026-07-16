import { useEffect, useState } from "react";
import { useGameStore } from "../../stores/useGameStore";

const CrosshairUI = () => {
  const spread = useGameStore((state) => state.crosshairSpread);
  const isLocked = useGameStore((state) => state.isLocked);
  const matchState = useGameStore((state) => state.matchState);

  const [isHoldingTab, setIsHoldingTab] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") setIsHoldingTab(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Tab") setIsHoldingTab(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // if the mouse is unlocked, the match is over, or the scoreboard is open
  if (!isLocked || matchState === "ended" || isHoldingTab) return null;

  const baseOffset = 8;
  const currentOffset = baseOffset + spread;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {/* top Line */}
      <div
        className="absolute bg-white/90 w-1 h-3 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateY(-${currentOffset}px)` }}
      />
      {/* bottom Line */}
      <div
        className="absolute bg-white/90 w-1 h-3 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateY(${currentOffset}px)` }}
      />
      {/* left Line */}
      <div
        className="absolute bg-white/90 w-3 h-1 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateX(-${currentOffset}px)` }}
      />
      {/* right Line */}
      <div
        className="absolute bg-white/90 w-3 h-1 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateX(${currentOffset}px)` }}
      />
      {/* small Center Dot */}
      <div className="absolute bg-white/80 w-1 h-1 rounded-full" />
    </div>
  );
};

export default CrosshairUI;

import { useGameStore } from "../../stores/useGameStore";

const CrosshairUI = () => {
  const spread = useGameStore((state) => state.crosshairSpread);
  const isLocked = useGameStore((state) => state.isLocked);

  // hide the crosshair if we are in the menu
  if (!isLocked) return null;

  // the base distance the lines sit from the center
  const baseOffset = 8;
  const currentOffset = baseOffset + spread;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {/* Top Line */}
      <div
        className="absolute bg-white/90 w-1 h-3 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateY(-${currentOffset}px)` }}
      />
      {/* Bottom Line */}
      <div
        className="absolute bg-white/90 w-1 h-3 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateY(${currentOffset}px)` }}
      />
      {/* Left Line */}
      <div
        className="absolute bg-white/90 w-3 h-1 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateX(-${currentOffset}px)` }}
      />
      {/* Right Line */}
      <div
        className="absolute bg-white/90 w-3 h-1 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
        style={{ transform: `translateX(${currentOffset}px)` }}
      />

      {/* Optional: Small Center Dot */}
      <div className="absolute bg-white/80 w-1 h-1 rounded-full" />
    </div>
  );
};

export default CrosshairUI;

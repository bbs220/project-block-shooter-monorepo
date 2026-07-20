import { useEffect, useState, useRef } from "react";
import { useGameStore } from "../../stores/useGameStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CrosshairUI = () => {
  const spread = useGameStore((state) => state.crosshairSpread);
  const isLocked = useGameStore((state) => state.isLocked);
  const matchState = useGameStore((state) => state.matchState);
  const [isHoldingTab, setIsHoldingTab] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

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

  // animation Block
  useGSAP(() => {
    // if refs are null
    if (
      !topRef.current ||
      !bottomRef.current ||
      !leftRef.current ||
      !rightRef.current
    )
      return;

    const baseOffset = 8;
    const currentOffset = baseOffset + spread;

    // very fast, snappy out-easing so recoil kicks hard but recovers smoothly
    const config = {
      duration: 0.15,
      ease: "power2.out",
      overwrite: "auto" as const, // prevents animation conflicts if you click rapidly
    };

    gsap.to(topRef.current, { y: -currentOffset, ...config });
    gsap.to(bottomRef.current, { y: currentOffset, ...config });
    gsap.to(leftRef.current, { x: -currentOffset, ...config });
    gsap.to(rightRef.current, { x: currentOffset, ...config });
  }, [spread]);

  if (!isLocked || matchState === "ended" || isHoldingTab) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {/* Top Line */}
      <div
        ref={topRef}
        className="absolute bg-white/90 w-1 h-3 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
      />
      {/* Bottom Line */}
      <div
        ref={bottomRef}
        className="absolute bg-white/90 w-1 h-3 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
      />
      {/* Left Line */}
      <div
        ref={leftRef}
        className="absolute bg-white/90 w-3 h-1 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
      />
      {/* Right Line */}
      <div
        ref={rightRef}
        className="absolute bg-white/90 w-3 h-1 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.8)]"
      />
      {/* Small Center Dot */}
      <div className="absolute bg-white/80 w-1 h-1 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export default CrosshairUI;

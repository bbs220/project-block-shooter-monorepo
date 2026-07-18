import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useGameStore } from "../../stores/useGameStore";

const LoadingScreen = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);
  const me = localId ? players[localId] : null;

  const containerRef = useRef<HTMLDivElement>(null);

  // local state to actually delete the component AFTER the animation
  const [isMounted, setIsMounted] = useState(true);

  useGSAP(() => {
    // 'me' exists, it means we connected
    if (me) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          // runs exactly when the 600ms fade is done
          setIsMounted(false);
        },
      });
    }
  }, [me]); //  effect whenever 'me' changes

  // hide the UI completely once GSAP says it's done
  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 bg-neutral-900/95 backdrop-blur-sm flex items-center justify-center"
    >
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

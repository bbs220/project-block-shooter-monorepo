import { Crosshair } from "lucide-react";

export default function CrosshairUI() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      <Crosshair
        className="text-white drop-shadow-md opacity-80"
        size={24}
        strokeWidth={2}
      />
    </div>
  );
}

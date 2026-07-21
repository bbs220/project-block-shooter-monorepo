import { useNavigate } from "react-router";
import { Monitor } from "lucide-react";
import useSound from "use-sound";
import { soundBank } from "../utils/assetPaths";

const WelcomePage = () => {
  const [playClick] = useSound(soundBank.click, { volume: 0.5 });
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white font-sans">
      <div className="max-w-md w-full p-8 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 text-center">
        <h1 className="text-5xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-gray-100 to-gray-500">
          BLOCK SHOOTER
        </h1>
        <p className="text-neutral-400 mb-8 font-medium tracking-wide">
          8-Player Arena FPS
        </p>

        <button
          onClick={() => {
            navigate("/play");
            playClick();
          }}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white text-xl font-black tracking-widest uppercase rounded-lg transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
        >
          Join Match
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-amber-500 bg-amber-500/10 py-2 rounded-full border border-amber-500/20 pointer-events-none">
          <Monitor className="animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest">
            Desktop Only [BETA]
          </span>
        </div>

        <p className="mt-6 text-xs text-neutral-500 uppercase tracking-widest">
          Server dictates Game Mode
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;

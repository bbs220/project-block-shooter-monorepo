import { useNavigate } from "react-router";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handlePlay = (mode: string) => {
    // later, we can pass this mode to the server or zustand store.
    // for now, just route them to the game canvas.
    navigate(`/play?mode=${mode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white font-sans">
      <div className="max-w-md w-full p-8 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 text-center">
        <h1 className="text-5xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-gray-100 to-gray-500">
          BLOCK SHOOTER
        </h1>
        <p className="text-neutral-400 mb-8 font-medium tracking-wide">
          8-Player Arena FPS
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handlePlay("tdm")}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
          >
            Team Deathmatch
          </button>

          <button
            onClick={() => handlePlay("ctp")}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-orange-900/20 cursor-pointer"
          >
            Capture the Point
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

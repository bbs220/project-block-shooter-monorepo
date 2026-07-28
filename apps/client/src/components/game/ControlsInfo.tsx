const ControlsInfo = () => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 font-mono text-[10px] sm:text-xs pointer-events-none bg-black/60 px-6 py-2 backdrop-blur-md border-t border-white/10 whitespace-nowrap z-50">
      <div className="flex gap-3 items-center">
        <span>
          <strong className="text-white">WASD</strong> Move
        </span>
        <span className="w-1 h-1 bg-white/20"></span>
        <span>
          <strong className="text-white">SPACE</strong> Jump
        </span>
        <span className="w-1 h-1 bg-white/20"></span>
        <span>
          <strong className="text-white">SHIFT</strong> Sprint
        </span>
      </div>

      {/* Line 2: Combat */}
      <div className="flex gap-3 items-center">
        <span>
          <strong className="text-white">L-CLICK</strong> Fire
        </span>
        <span className="w-1 h-1 bg-white/20"></span>
        <span>
          <strong className="text-white">R-CLICK</strong> Aim
        </span>
        <span className="w-1 h-1 bg-white/20"></span>
        <span>
          <strong className="text-white">R</strong> Reload
        </span>
        <span className="w-1 h-1 bg-white/20"></span>
        <span>
          <strong className="text-white">1-3</strong> Weapons
        </span>
      </div>
    </div>
  );
};

export default ControlsInfo;

import { useGameStore } from "../stores/useGameStore";

const NavBar = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  // find the current player's data from the store
  const me = localId ? players[localId] : null;

  return (
    <nav className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none">
      {me ? (
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: me.color }}
          />
          <span className="text-white font-bold text-lg drop-shadow-md">
            {me.name}
          </span>
        </div>
      ) : (
        <span className="text-white font-bold text-lg drop-shadow-md">
          Connecting...
        </span>
      )}
    </nav>
  );
};

export default NavBar;

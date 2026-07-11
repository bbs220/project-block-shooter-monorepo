import { useEffect } from "react";
import geckos from "@geckos.io/client";
import { useGameStore } from "../stores/useGameStore";

export function NetworkManager() {
  const setPlayers = useGameStore((state) => state.setPlayers);

  useEffect(() => {
    // connect to local server
    const channel = geckos({ port: 9208 });

    channel.onConnect((error) => {
      if (error) {
        console.error("Connection error", error);
        return;
      }

      // send dummy movement on keydown
      const handleKeyDown = (e: KeyboardEvent) => {
        const move = { x: 0, y: 0, z: 0 };
        if (e.key === "w") move.z = -1;
        if (e.key === "s") move.z = 1;
        if (e.key === "a") move.x = -1;
        if (e.key === "d") move.x = 1;
        channel.emit("move", move);
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    });

    // update zustand store with server state
    channel.on("state", (data: any) => {
      setPlayers(data);
    });

    return () => {
      // strict mode safe cleanup
      try {
        channel.close();
      } catch (err) {
        console.warn("Geckos cleanup bypassed during strict mode remount", err);
      }
    };
  }, [setPlayers]);

  return null;
}

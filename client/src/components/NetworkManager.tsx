import { useEffect } from "react";
import geckos from "@geckos.io/client";
import { useGameStore } from "../stores/useGameStore";

export function NetworkManager() {
  const setPlayers = useGameStore((state) => state.setPlayers);
  const setLocalId = useGameStore((state) => state.setLocalId);

  useEffect(() => {
    const channel = geckos({ port: 9208 });

    channel.onConnect((error) => {
      if (error) {
        console.error("Connection error", error);
        return;
      }

      // store the local client id
      if (channel.id) {
        setLocalId(channel.id);
      }

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

    channel.on("state", (data: any) => {
      setPlayers(data);
    });

    return () => {
      // catch strict mode unmounts
      try {
        channel.close();
      } catch (err) {
        console.warn("Geckos cleanup bypassed", err);
      }
    };
  }, [setPlayers, setLocalId]);

  return null;
}

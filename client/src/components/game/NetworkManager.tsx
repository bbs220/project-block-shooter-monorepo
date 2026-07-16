import { useEffect } from "react";
import geckos from "@geckos.io/client";
import { useGameStore } from "../../stores/useGameStore";

export function NetworkManager() {
  const setPlayers = useGameStore((state) => state.setPlayers);
  const setLocalId = useGameStore((state) => state.setLocalId);
  const setChannel = useGameStore((state) => state.setChannel);

  useEffect(() => {
    // connect to the default geckos port on localhost
    const channel = geckos({ port: 9208 });

    channel.onConnect((error) => {
      if (error) {
        console.error("connection error", error);
        return;
      }

      console.log("connected to server!");

      // store the local client id and the channel globally
      if (channel.id) {
        setLocalId(channel.id);
        setChannel(channel);
      }

      const searchParams = new URLSearchParams(window.location.search);
      const requestedMode = searchParams.get("mode") || "tdm";
      channel.emit("set_mode", requestedMode);

      // send a test message
      channel.emit("chat message", "hello from the r3f client");
    });

    // listen for the server echo or test messages
    channel.on("chat message", (data) => {
      console.log("message from server:", data);
    });

    // update zustand with authoritative server state
    channel.on("state", (data: any) => {
      const { players, ...matchInfo } = data;

      // sync using the two separate zustand setters
      useGameStore.getState().setPlayers(players);
      useGameStore.getState().updateMatchData(matchInfo);
    });

    channel.on("kill_feed", (data: any) => {
      useGameStore.getState().addKillEvent({
        ...data,
        timestamp: Date.now(),
      });
    });

    return () => {
      // catch strict mode unmounts before webrtc is ready
      try {
        channel.close();
      } catch (err) {
        console.warn("geckos cleanup bypassed during strict mode remount", err);
      }
    };
  }, [setPlayers, setLocalId, setChannel]);

  return null;
}

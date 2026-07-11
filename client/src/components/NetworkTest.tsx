import { useEffect } from "react";
import geckos from "@geckos.io/client";

export function NetworkTest() {
  useEffect(() => {
    // connect to the default geckos port on localhost
    const channel = geckos({
      port: 9208,
      //   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    channel.onConnect((error) => {
      if (error) {
        console.error("connection error", error);
        return;
      }
      console.log("connected to server!");

      // send a test message
      channel.emit("chat message", "hello from the r3f client");
    });

    // listen for the server echo
    channel.on("chat message", (data) => {
      console.log("message from server:", data);
    });

    return () => {
      // catch strict mode unmounts before webrtc is ready
      try {
        channel.close();
      } catch (err) {
        console.warn("geckos cleanup bypassed during strict mode remount", err);
      }
    };
  }, []);

  return null;
}

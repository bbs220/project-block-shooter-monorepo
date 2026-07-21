import { Canvas } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Loader,
  PerspectiveCamera,
} from "@react-three/drei";
import LocalPlayer from "./LocalPlayer";
import Ground from "./Ground";
import { NetworkManager } from "./NetworkManager";
import CrosshairUI from "./CrosshairUI";
import { Physics } from "@react-three/rapier";
import { useTweakpane } from "../../hooks/useTweakPane";
import PlayButtonUI from "./PlayButtonUI";
import MatchTimerUI from "./MatchTimerUI";
import ScoreboardUI from "./ScoreboardUI";
import KillFeedUI from "./KillFeedUI";
import RemotePlayers from "./RemotePlayers";
import LoadingScreen from "./LoadingScreen";
import { GRAVITY } from "@block-shooter/shared";
import { FOV } from "../../utils/tunablesClient";
import SoundManager from "./SoundManager";

const PrimaryScene = () => {
  const { showPhyDebug, showGizmo } = useTweakpane({
    showPhyDebug: false,
    showGizmo: false,
  });

  return (
    <>
      {/* rapier physics */}
      <Physics debug={showPhyDebug} gravity={[GRAVITY.x, GRAVITY.y, GRAVITY.z]}>
        <PerspectiveCamera makeDefault fov={FOV} />
        <GizmoHelper alignment="top-left" margin={[450, 100]}>
          <GizmoViewport labelColor="white" visible={showGizmo} />
        </GizmoHelper>
        <ambientLight color="#ffffff" intensity={0.8} />
        <directionalLight position={[0, 5, 0]} intensity={1} castShadow />
        <>
          {/* captures mouse and moves camera for local player */}
          <LocalPlayer />
          {/* render all players EXCEPT the local one */}
          <RemotePlayers />
          {/* something to stand on */}
          <Ground />
        </>
      </Physics>
    </>
  );
};

const PrimaryCanvas = () => {
  return (
    <>
      {/* sits on top until player data exists */}
      <LoadingScreen />
      {/* cursor for aim */}
      <CrosshairUI />
      {/* container for pointer controls */}
      <PlayButtonUI />
      {/* match timer */}
      <MatchTimerUI />
      {/* scoreboard tracker */}
      <ScoreboardUI />
      {/* tiny kill feed of the match in a corner */}
      <KillFeedUI />
      {/* network manager runs silently outside the 3d canvas */}
      <NetworkManager />
      {/* responsible for all 2d and ui sounds */}
      <SoundManager />
      {/* main 3d viewport */}
      <Canvas shadows="variance">
        <color attach="background" args={["#404040"]} />
        <PrimaryScene />
      </Canvas>
      {/* loading screen */}
      <Loader
        containerStyles={{ backgroundColor: "#171717" }}
        innerStyles={{ width: "300px" }}
        barStyles={{ backgroundColor: "#3b82f6" }}
      />
    </>
  );
};

export default PrimaryCanvas;

import { GRAVITY } from "@block-shooter/shared";
import {
  GizmoHelper,
  GizmoViewport,
  Loader,
  PerspectiveCamera,
  Sky,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useTweakpane } from "../../hooks/useTweakPane";
import { FOV } from "../../utils/tunablesClient";
import CrosshairUI from "./CrosshairUI";
import ArenaGeometry from "./ArenaGeometry";
import KillFeedUI from "./KillFeedUI";
import LocalPlayer from "./LocalPlayer";
import MatchTimerUI from "./MatchTimerUI";
import { NetworkManager } from "./NetworkManager";
import PlayButtonUI from "./PlayButtonUI";
import RemotePlayers from "./RemotePlayers";
import ScoreboardUI from "./ScoreboardUI";
import { SoundManager } from "./SoundManager";
import WeaponViewmodel from "./WeaponViewModel";
import AdsVignette from "./AdsVigette";
import PlayerInfoUI from "./PlayerInfoUI";

const PrimaryScene = () => {
  const { showPhyDebug, showGizmo } = useTweakpane({
    showPhyDebug: false,
    showGizmo: false,
  });

  return (
    <>
      {/* rapier physics */}
      <Physics debug={showPhyDebug} gravity={[GRAVITY.x, GRAVITY.y, GRAVITY.z]}>
        <PerspectiveCamera makeDefault fov={FOV}>
          <WeaponViewmodel />
        </PerspectiveCamera>
        <GizmoHelper alignment="top-left" margin={[60, 120]}>
          <GizmoViewport labelColor="white" visible={showGizmo} />
        </GizmoHelper>
        <Stats showPanel={0} />
        <ambientLight intensity={1} color={"#ffffff"} />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
        />
        <>
          {/* captures mouse and moves camera for local player */}
          <LocalPlayer />
          {/* render all players EXCEPT the local one */}
          <RemotePlayers />
          {/* something to stand on */}
          <ArenaGeometry />
        </>
      </Physics>
    </>
  );
};

const PrimaryCanvas = () => {
  return (
    <>
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
      {/* stuff like health and ammo */}
      <PlayerInfoUI />
      {/* network manager runs silently outside the 3d canvas */}
      <NetworkManager />
      {/* responsible for all 2d and ui sounds */}
      <SoundManager />
      {/* main 3d viewport */}
      <Canvas shadows="variance" dpr={1}>
        <PrimaryScene />
        <AdsVignette />
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

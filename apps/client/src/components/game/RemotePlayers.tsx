import { RigidBody } from "@react-three/rapier";
import { useGameStore } from "../../stores/useGameStore";
import PlayerLabel from "./PlayerLabel";
import { PLAYER_CONFIG } from "@block-shooter/shared";

const RemotePlayers = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  return (
    <>
      {Object.entries(players)
        .filter(([id, pos]) => id !== localId && !pos.isDead)
        .map(([id, pos]) => (
          <RigidBody
            key={id}
            type="kinematicPosition"
            position={[pos.x, pos.y, pos.z]}
          >
            <group rotation={[0, pos.yaw, 0]}>
              {/* removed the Y=1 offset! Center is center! */}
              <mesh castShadow position={[0, 0, 0]}>
                <capsuleGeometry
                  args={[
                    PLAYER_CONFIG.RADIUS,
                    PLAYER_CONFIG.HALF_HEIGHT * 2,
                    4,
                    16,
                  ]}
                />
                <meshStandardMaterial color={pos.color} />
              </mesh>
              <PlayerLabel player={pos} />
            </group>
          </RigidBody>
        ))}
    </>
  );
};

export default RemotePlayers;

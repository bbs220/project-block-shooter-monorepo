# Block Shooter - MVP Status Report

## ✅ Completed: Core Engine & Combat
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Networking** | Finished | Authoritative Node.js server using Geckos.io. |
| **Physics & Tick** | Finished | 60Hz server heartbeat using Rapier3D. |
| **Movement** | Finished | Client-side prediction with true FPS camera math. |
| **Advanced Movement**| Finished | Server-side gravity, jumping, and sprint tracking. |
| **Combat Loop** | Finished | Authoritative raycasting, team balancing, and kill tracking. |
| **Weapon System** | Finished | Stats tree (Assault Rifle, Pistol, Burst Rifle) with icon support. |
| **Client UI** | Finished | Crosshair, HUD, Loading Screen, Kill Feed, Scoreboard, and Top-Bar. |

## ✅ Completed: Match Structure
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Lobby UI** | Finished | Welcome Page with Desktop warning and "Join Match" entry point. |
| **Match Timers** | Finished | 1Hz server loop handling 4-minute rounds and 5-second resets. |
| **Playlist Logic** | Finished | Server-side random mode rotation (TDM/CTP) on match restart. |
| **Score Sync** | Finished | Live team score updates linked to player kills. |
| **World Boundaries** | Finished | Added -50y Death Zone sensor checking with reusable respawn function. |
| **Teleport Sync** | Finished | Client-side distance threshold check to prevent rubberbanding ghosts. |

## ⏳ Remaining Tasks (The Final Stretch)
| Feature | Details |
| :--- | :--- |
| **TDM Score Limits** | Add "Mercy Rule": End the match immediately if a team hits 30 kills. |
| **Capture the Point** | Define a physical capture zone; track player presence and award periodic points. |
| **3D Assets** | Swap placeholder geometry with actual 3D weapon models (GLTF/GLB) attached to the viewport. |
| **Aim Down Sights (ADS)**| Right-click purely client-side state for FOV zoom and weapon centering. |
| **Camera Headbob** | Tune and hardcode the client-side sine-wave camera bobbing for walk/sprint. |
| **Audio Architecture** | Implement hybrid system: `use-sound` for UI/2D feedback and `<PositionalAudio>` for 3D environment sounds. |
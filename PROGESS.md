# Block Shooter - MVP Status Report

## ✅ Completed: Core Engine & Combat
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Networking** | Finished | Authoritative Node.js server using Geckos.io. |
| **Physics & Tick** | Finished | 60Hz server heartbeat using Rapier3D. |
| **Movement** | Finished | Client-side prediction with true FPS camera math. |
| **Combat Loop** | Finished | Authoritative raycasting, team balancing, and kill tracking. |
| **Weapon System** | Finished | Stats tree (Assault Rifle, Pistol, Burst Rifle) with icon support. |
| **Client UI** | Finished | Crosshair, HUD, Loading Screen, Kill Feed, Scoreboard, and Top-Bar Match Info. |

## ✅ Completed: Match Structure
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Lobby UI** | Finished | Welcome Page with Desktop warning and "Join Match" entry point. |
| **Match Timers** | Finished | 1Hz server loop handling 4-minute rounds and 5-second resets. |
| **Playlist Logic** | Finished | Server-side random mode rotation (TDM/CTP) on match restart. |
| **Score Sync** | Finished | Live team score updates linked to player kills. |

## ⏳ Remaining Tasks (The Final Stretch)
| Feature | Details |
| :--- | :--- |
| **TDM Score Limits** | Add "Mercy Rule": End the match immediately if a team hits 30 kills. |
| **Capture the Point** | Define a physical capture zone; track player presence and award periodic points. |
| **Advanced Movement** | Wire up Sprint and Jump inputs to server physics; add client-side camera headbob for game feel. |
| **3D Assets** | Swap placeholder geometry with actual 3D weapon models (GLTF/GLB) attached to the viewport. |
| **Audio Architecture** | Implement hybrid system: `use-sound` for 2D UI feedback (hit markers, clicks) and `@react-three/drei` `<PositionalAudio>` for 3D spatial sounds (gunshots, footsteps). |
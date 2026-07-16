# Block Shooter - MVP Status Report

## ✅ Completed: Core Engine & Combat
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Networking** | Finished | Authoritative Node.js server using Geckos.io for low-latency UDP-like communication. |
| **Physics & Tick** | Finished | 60Hz server heartbeat running headless `@dimforge/rapier3d-compat` for true collision tracking. |
| **Movement** | Finished | Client-side prediction with true FPS camera math. |
| **Combat Loop** | Finished | Authoritative hitscan raycasting, team auto-balancing, and friendly-fire prevention. |
| **Weapon System** | Finished | Stats tree (Rifle, Pistol, Burst Rifle) with fire rates, clip sizes, and reloading mechanics. |
| **Client UI** | Finished | Dynamic crosshair, unified HUD with weapon icons, self-cleaning Kill Feed, and 4v4 Scoreboard. |

## ✅ Completed: Match Structure
| Feature | Status | Details |
| :--- | :--- | :--- |
| **Lobby UI** | Finished | React Router based Welcome Page for mode selection. |
| **Match Timers** | Finished | 1Hz server loop handling 4-minute rounds, match states (`playing`, `ended`), and auto-restarts. |

## ⏳ Remaining Tasks (The Final 10%)
| Feature | Details |
| :--- | :--- |
| **TDM Score Limits** | Adding server logic to end the match early if a team hits a specific kill limit (e.g., 30 kills). |
| **Mode Syncing** | Passing the `?mode=` query parameter from the Welcome Page to the server so it configures the right match type. |
| **Capture the Point** | Defining a physical capture zone in the map, tracking player presence inside it, and awarding points over time. |
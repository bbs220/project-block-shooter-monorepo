import Stats from "stats-gl";
import { Pane } from "tweakpane";

const framesMonitor = new Stats({
  trackGPU: true,
  trackHz: true,
  trackCPT: true,
  horizontal: false,
});
document.body.appendChild(framesMonitor.dom);

const inspectorUI = new Pane({ title: "⚙️ Settings", expanded: false });

export { inspectorUI, framesMonitor };

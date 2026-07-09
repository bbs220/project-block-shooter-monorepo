/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Pane } from "tweakpane";

export function useTweakpane(config: Record<string, any>) {
  // initialize state using the incoming 'config' directly.
  // this callback only executes ONCE during the initial render.
  const [params, setParams] = useState(() => {
    const initialState: Record<string, any> = {};

    Object.keys(config).forEach((key) => {
      initialState[key] =
        typeof config[key] === "object" && "value" in config[key]
          ? config[key].value
          : config[key];
    });
    return initialState;
  });

  // store the initial config to safely use inside the useEffect
  // without triggering exhaustive-deps warnings.
  const configRef = useRef(config);

  // tweakpane mutates this object directly
  const stateRef = useRef(params);

  useEffect(() => {
    const pane = new Pane({ title: "🛠️ Controls" });

    // reading a ref inside useEffect happens AFTER render.
    const initialConfig = configRef.current;

    Object.keys(initialConfig).forEach((key) => {
      const item = initialConfig[key];
      const options = typeof item === "object" && "value" in item ? item : {};

      pane.addBinding(stateRef.current, key, options).on("change", (ev) => {
        setParams((prev) => ({ ...prev, [key]: ev.value }));
      });
    });

    return () => pane.dispose();
  }, []); // empty array is compliant because configRef is stable

  return params;
}

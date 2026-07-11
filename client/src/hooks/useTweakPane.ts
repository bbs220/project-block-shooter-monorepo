import { useState, useEffect, useRef } from "react";
import { Pane } from "tweakpane";

// conditional type: Extracts 'V' if it's { value: V }, otherwise returns the type itself
type ExtractValue<T> = T extends { value: infer V } ? V : T;

// mapped type: Loops over your config object and applies ExtractValue to every key
type TweakpaneState<T> = {
  [K in keyof T]: ExtractValue<T[K]>;
};

// rhe generic <T extends Record<string, unknown>> captures the exact shape of the input
export function useTweakpane<T extends Record<string, unknown>>(
  config: T,
): TweakpaneState<T> {
  const [params, setParams] = useState<TweakpaneState<T>>(() => {
    // cast the initial state to our mapped type
    const initialState = {} as TweakpaneState<T>;

    (Object.keys(config) as Array<keyof T>).forEach((key) => {
      const item = config[key];

      // determine if it's a tweakpane options object with a 'value' property
      const isObjectConfig =
        typeof item === "object" && item !== null && "value" in item;

      initialState[key] = (
        isObjectConfig ? (item as { value: unknown }).value : item
      ) as ExtractValue<T[keyof T]>;
    });

    return initialState;
  });

  const configRef = useRef(config);
  const stateRef = useRef(params);

  useEffect(() => {
    const pane = new Pane({ title: "🛠️ Controls" });
    const initialConfig = configRef.current;

    (Object.keys(initialConfig) as Array<keyof T>).forEach((key) => {
      const item = initialConfig[key];
      const options =
        typeof item === "object" && item !== null && "value" in item
          ? item
          : {};

      pane
        .addBinding(stateRef.current, key as string, options)
        .on("change", (ev) => {
          setParams((prev) => ({ ...prev, [key]: ev.value }));
        });
    });

    return () => pane.dispose();
  }, []);

  return params;
}

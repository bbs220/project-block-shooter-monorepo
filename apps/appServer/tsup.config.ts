import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  // this tells tsup to bundle your shared package directly into the build
  noExternal: ["@block-shooter/shared"],
});

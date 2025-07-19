import * as THREE from "three";

export const progressManager = new THREE.LoadingManager();

progressManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log(
    `Loading file: ${url} \nLoaded ${itemsLoaded} of ${itemsTotal} files`
  );
  progressManager.onLoad = () => {
    console.log("Loading complete!");
  };
  progressManager.onError = function (url) {
    console.log(`There was an error loading ${url}`);
  };
};

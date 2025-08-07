import * as THREE from "three";

export const progressManager = new THREE.LoadingManager();

const loadingBackground = document.getElementById(
  "loadingBackground"
) as HTMLDivElement;
const loadingBar = document.getElementById("loadingBar") as HTMLDivElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;

progressManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  const progressPercentage = (itemsLoaded / itemsTotal) * 100;
  loadingBar.style.width = `${progressPercentage}%`;
  console.log(
    `Loading file: ${url} \nLoaded ${itemsLoaded} of ${itemsTotal} files`
  );
};

progressManager.onLoad = () => {
  startButton.style.opacity = "1";
  startButton.style.cursor = "pointer";

  startButton.addEventListener("click", () => {
    loadingBackground.style.opacity = "0";
    setTimeout(() => {
      loadingBackground.style.display = "none";
    }, 500);
  });
  console.log("Loading complete!");
};

progressManager.onError = function (url) {
  console.log(`There was an error loading ${url}`);
};

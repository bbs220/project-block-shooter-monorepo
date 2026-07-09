import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { primaryRouter } from "./primaryRouter.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={primaryRouter} />
  </StrictMode>,
);

import { createBrowserRouter } from "react-router";

import App from "./App";
import LayoutState from "./layout/LayoutState";
import HomePage from "./pages/HomePage";

export const primaryRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <LayoutState>
            <HomePage />
          </LayoutState>
        ),
      },
    ],
  },
]);

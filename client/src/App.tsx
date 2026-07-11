import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import { NetworkTest } from "./components/NetworkTest";

function App() {
  return (
    <>
      <div className="font-inter overflow-x-hidden h-full w-full">
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
      <NetworkTest />
    </>
  );
}

export default App;

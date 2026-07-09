import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div className="font-inter overflow-x-hidden h-full w-full">
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;

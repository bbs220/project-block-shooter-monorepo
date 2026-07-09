import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import type { typeLayoutState } from "../types/typesSource";

const LayoutState = ({ children }: typeLayoutState) => {
  return (
    <>
      <div className="z-100">
        <NavBar />
        <SideBar />
      </div>
      {children}
    </>
  );
};
export default LayoutState;

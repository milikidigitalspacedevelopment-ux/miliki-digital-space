import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

function PublicLayout() {
  //console.log("[dev] PublicLayout render");
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default PublicLayout;
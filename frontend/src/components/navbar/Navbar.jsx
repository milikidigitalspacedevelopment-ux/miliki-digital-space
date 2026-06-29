import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import { List } from "react-bootstrap-icons";

function Navbar() {
  console.log("[dev] Navbar render");
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () =>
    setMenuOpen((s) => {
      const next = !s;
      console.log("[dev] Navbar toggle ->", next);
      return next;
    });

  return (
    <>
      <TopBar />

      <nav className="navbar bg-white shadow-sm sticky-top">
        <div className="container d-flex flex-column flex-lg-row align-items-center">

          {/* Upper Row */}
          <div className="d-flex justify-content-between align-items-center w-100 py-2 flex-grow-1">
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-success d-lg-none me-2 mobile-toggle-btn"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={menuOpen}
              >
                <List />
              </button>

              <Link className="navbar-brand fw-bold text-success mb-0" to="/">
                Miliki Digital Space
              </Link>
            </div>

            <button className="btn btn-success d-none d-lg-block">Join Now</button>
          </div>

          {/* Lower Row */}
          <MobileMenu open={menuOpen} setOpen={setMenuOpen} />

        </div>
      </nav>
    </>
  );
}

export default Navbar;
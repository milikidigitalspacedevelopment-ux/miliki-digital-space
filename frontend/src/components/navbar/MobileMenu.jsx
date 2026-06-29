import NavLinks, { links } from "./NavLinks";
import { Link } from "react-router-dom";
import {
  House,
  InfoCircle,
  Briefcase,
  Newspaper,
  Telephone,
  Book,
  Calendar,
  Heart,
  People,
  Gift,
  ChevronLeft,
  ChevronRight,
  List,
  X,
} from "react-bootstrap-icons";
import { useEffect, useRef } from "react";

function MobileMenu({ open, setOpen }) {
  useEffect(() => {
    console.log("[dev] MobileMenu open ->", open);
  }, [open]);
  const sidebarRef = useRef(null);

  // (no body padding toggle) sidebar will overlay content without shifting body

  // Close when clicking outside sidebar (but ignore clicks on bottom bar)
  useEffect(() => {
    function handleClick(e) {
      if (!sidebarRef.current) return;
      if (sidebarRef.current.contains(e.target)) return;
      const bottom = document.querySelector(".mobile-bottom-bar");
      if (bottom && bottom.contains(e.target)) return;
      // Ignore clicks on the navbar toggle button so opening doesn't immediately close
      const toggle = document.querySelector(".mobile-toggle-btn");
      if (toggle && toggle.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Define which links live where. Home must be only at bottom per request.
  const bottomKeys = ["/", "/programs", "/courses", "/blog", "/contact"];
  const bottomLinks = links.filter((l) => bottomKeys.includes(l.path));
  const sidebarLinks = links.filter((l) => !bottomKeys.includes(l.path));

  return (
    <>
      {/* Desktop Navigation */}
      <div className="d-none d-lg-flex align-items-center">
        <ul className="navbar-nav d-flex flex-row align-items-center gap-3 mb-0">
          <NavLinks />
        </ul>
      </div>

      {/* Mobile Sidebar (collapsible) */}
      <div
        ref={sidebarRef}
        className={`d-lg-none mobile-sidebar bg-primary text-white ${open ? "open" : "closed"}`}
        aria-hidden={!open}
      >
        <div className="sidebar-inner w-100 d-flex flex-column align-items-stretch">
              <div className="d-flex justify-content-end p-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center toggle-btn"
                  onClick={() => setOpen((s) => !s)}
                  aria-label={open ? "Close navigation" : "Open navigation"}
                  aria-expanded={open}
                >
                  {open ? <X /> : <List />}
                </button>
              </div>

          <ul className="nav flex-column mb-0 mt-2">
            {sidebarLinks.map((link) => {
              const Icon = (() => {
                switch (link.path) {
                  case "/about":
                    return InfoCircle;
                  case "/programs":
                    return Briefcase;
                  case "/courses":
                    return Book;
                  case "/events":
                    return Calendar;
                  case "/blog":
                    return Newspaper;
                  case "/impact":
                    return Heart;
                  case "/volunteer":
                    return People;
                  case "/donate":
                    return Gift;
                  default:
                    return InfoCircle;
                }
              })();

              return (
                <li key={link.path} className="nav-item">
                  <Link to={link.path} className="nav-link d-flex align-items-center text-white">
                    <Icon className="me-2 sidebar-icon" />
                    <span className="link-text">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* open button moved to Navbar (top) to keep toggle next to brand) */}

      {/* Mobile Bottom Bar (main items, full-width, no scroll) */}
      <div
        className="d-lg-none position-fixed bottom-0 start-0 w-100 bg-primary shadow-sm border-top mobile-bottom-bar"
        style={{ zIndex: 1060 }}
      >
        <div className="d-flex align-items-center justify-content-around py-2">
          {bottomLinks.map((link) => {
            const Icon = (() => {
              switch (link.path) {
                case "/":
                  return House;
                case "/programs":
                  return Briefcase;
                case "/courses":
                  return Book;
                case "/blog":
                  return Newspaper;
                case "/contact":
                  return Telephone;
                default:
                  return House;
              }
            })();

            return (
              <Link key={link.path} to={link.path} className="text-white text-center main-bottom-link">
                <Icon />
                <div style={{ fontSize: "12px" }}>{link.name}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
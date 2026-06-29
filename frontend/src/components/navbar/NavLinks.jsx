import { NavLink } from "react-router-dom";

export const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Courses", path: "/courses" },
  { name: "Events", path: "/events" },
  { name: "Blog", path: "/blog" },
  { name: "Impact", path: "/impact" },
  { name: "Volunteer", path: "/volunteer" },
  { name: "Donate", path: "/donate" },
  { name: "Contact", path: "/contact" },
];

function NavLinks() {
  return (
    <>
      {links.map((link) => (
        <li key={link.path} className="nav-item">
          <NavLink
            to={link.path}
            className="nav-link fw-semibold px-3 py-2 text-dark d-inline-block"
          >
            {link.name}
          </NavLink>
        </li>
      ))}
    </>
  );
}

export default NavLinks;
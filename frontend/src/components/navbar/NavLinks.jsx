import { NavLink } from "react-router-dom";

export const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Courses", path: "/courses" },
  { name: "Events", path: "/events" },
  { name: "Blog", path: "/blogs" },
  { name: "Impact", path: "/impact" },
  { name: "Volunteer", path: "/volunteer" },
  { name: "Donate", path: "/donate" },
  { name: "Stories", path: "/success-stories" },
  { name: "Contact", path: "/contact" },
];

function NavLinks() {
  return (
    <>
      {links.map((link) => (
        <li key={link.path} className="nav-item">
          <NavLink
            to={link.path}
            className="nav-link fw-bold px-3 py-2 text-success d-inline-block"
          >
            {link.name}
          </NavLink>
        </li>
      ))}
    </>
  );
}

export default NavLinks;
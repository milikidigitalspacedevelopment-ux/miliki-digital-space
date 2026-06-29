import SidebarItem from "./SidebarItem";

function DashboardSidebar({
  links,
  open = false,
  onCloseSidebar
}) {
  return (
    <aside
      className="bg-dark text-white p-3"
      style={{
        width: open ? "280px" : "0px",
        minHeight: "100vh",
        overflow: "hidden",
        display: open ? "block" : "none",
        transition: "width 0.3s ease-in-out",
        position: "relative",
        zIndex: 1000,
        flexShrink: 0
      }}
    >

      <h4 className="mb-4 text-warning">
        Miliki Digital Space
      </h4>

      <ul className="nav flex-column">

        {links.map((link) => (
          <SidebarItem
            key={link.path}
            {...link}
            onClick={onCloseSidebar}
          />
        ))}

      </ul>

    </aside>
  );
}

export default DashboardSidebar;
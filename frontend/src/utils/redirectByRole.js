import { ROLES } from "../constants/roles";

export function getDashboardPathByRole(role) {
  const normalizedRole = `${role || ""}`.toString().toLowerCase();

  switch (normalizedRole) {
    case ROLES.STUDENT:
      return "/student";

    case ROLES.TRAINER:
      return "/trainer";

    case ROLES.DONOR:
      return "/donor";

    case ROLES.VOLUNTEER:
      return "/volunteer/dashboard";

    case ROLES.PARTNER:
      return "/partner";

    case ROLES.ADMIN:
      return "/admin";

    case ROLES.SUPER_ADMIN:
    case "superadmin":
      return "/super-admin";

    default:
      return "/";
  }
}

export default function redirectByRole(role) {
  return getDashboardPathByRole(role);
}
import { ROLES } from "../constants/roles";

export default function redirectByRole(
  role
) {
  switch (role) {
    case ROLES.STUDENT:
      return "/student";

    case ROLES.TRAINER:
      return "/trainer";

    case ROLES.DONOR:
      return "/donor";

    case ROLES.VOLUNTEER:
      return "/volunteer";

    case ROLES.PARTNER:
      return "/partner";

    case ROLES.ADMIN:
      return "/admin";

    case ROLES.SUPER_ADMIN:
      return "/super-admin";

    default:
      return "/";
  }
}
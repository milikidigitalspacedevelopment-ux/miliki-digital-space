import { Routes } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import StudentRoutes from "./StudentRoutes";
import TrainerRoutes from "./TrainerRoutes";
import VolunteerRoutes from "./VolunteerRoutes";
import DonorRoutes from "./DonorRoutes";
import PartnerRoutes from "./PartnerRoutes";

function AppRoutes() {
  console.log("[dev] AppRoutes render");

  return (
    <Routes>
      {PublicRoutes()}
      {AuthRoutes()}
      {AdminRoutes()}
      {StudentRoutes()}
      {TrainerRoutes()}
      {VolunteerRoutes()}
      {DonorRoutes()}
      {PartnerRoutes()}
    </Routes>
  );
}

export default AppRoutes;
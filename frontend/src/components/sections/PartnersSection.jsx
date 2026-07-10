import { useEffect, useState } from "react";
import PartnerCard from "../cards/PartnerCard";
import partnerService from "../../services/partnerService";

function PartnersSection() {
  const [partners, setPartners] =
    useState([]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const response =
        await partnerService.listPartners();

      setPartners(response.data || response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-3 bg-light">

      <div className="container">

        <h2 className="fw-bold mb-4">
          Our Partners
        </h2>

        <div className="row">

          {partners.map((partner) => (
            <div
              className="col-lg-3 mb-4"
              key={partner.id}
            >
              <PartnerCard partner={partner} />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default PartnersSection;
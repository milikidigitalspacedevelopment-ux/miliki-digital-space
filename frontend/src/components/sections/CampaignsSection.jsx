import { useEffect, useState } from "react";
import CampaignCard from "../cards/CampaignCard";
import campaignService from "../../services/campaignService";

function CampaignsSection() {
  const [campaigns, setCampaigns] =
    useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getCampaigns();
      setCampaigns(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-5">

      <div className="container">

        <h2 className="fw-bold mb-4">
          Active Campaigns
        </h2>

        <div className="row">

          {campaigns.slice(0, 3).map(
            (campaign) => (
              <div
                className="col-lg-4 mb-4"
                key={campaign.id}
              >
                <CampaignCard
                  campaign={campaign}
                />
              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
}

export default CampaignsSection;
import { Link } from "react-router-dom";

function CampaignCard({ campaign }) {

  const progress =
    (campaign.raised_amount / campaign.goal_amount) * 100;

  return (
    <div className="card shadow-sm border-0 h-100">

      <img
        src={campaign.image}
        className="card-img-top"
        alt={campaign.title}
      />

      <div className="card-body">

        <h5>{campaign.title}</h5>

        <div className="progress mt-4">

          <div
            className="progress-bar bg-success"
            style={{
              width: `${progress}%`
            }}
          >
            {Math.round(progress)}%
          </div>

        </div>

      </div>

      <div className="card-footer bg-white border-0">

        <Link
          className="btn btn-warning w-100"
          to={`/campaigns/${campaign.slug}`}
        >
          Donate
        </Link>

      </div>

    </div>
  );
}

export default CampaignCard;
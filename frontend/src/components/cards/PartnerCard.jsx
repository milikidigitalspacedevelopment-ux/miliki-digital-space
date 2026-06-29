function PartnerCard({ partner }) {
  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body text-center">

        <img
          src={partner.logo}
          alt={partner.name}
          className="img-fluid"
          style={{ maxHeight: "100px" }}
        />

      </div>

    </div>
  );
}

export default PartnerCard;
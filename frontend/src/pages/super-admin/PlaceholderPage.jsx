import PropTypes from "prop-types";

function SuperAdminPlaceholderPage({ title, description }) {
  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h1 className="h3 mb-3">{title}</h1>
          <p className="text-muted mb-0">
            {description || `Manage ${title.toLowerCase()} from the super-admin console.`}
          </p>
        </div>
      </div>
    </div>
  );
}

SuperAdminPlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

SuperAdminPlaceholderPage.defaultProps = {
  description: "",
};

export default SuperAdminPlaceholderPage;

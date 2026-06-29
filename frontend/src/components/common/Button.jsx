import React from "react";
import PropTypes from "prop-types";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "",
  className = "",
  loading = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${size} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
          />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
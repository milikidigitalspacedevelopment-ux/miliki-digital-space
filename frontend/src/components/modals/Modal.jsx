function Modal({
  id,
  title,
  children,
  size = "",
  footer,
}) {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${size}`}>
        <div className="modal-content">

          <div className="modal-header">

            <h5 className="modal-title">
              {title}
            </h5>

            <button
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>

          </div>

          <div className="modal-body">
            {children}
          </div>

          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Modal;
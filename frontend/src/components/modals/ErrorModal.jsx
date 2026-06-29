import Modal from "./Modal";

function ErrorModal({
  id,
  title = "Error",
  message,
}) {
  return (
    <Modal
      id={id}
      title={title}
      footer={
        <button
          className="btn btn-danger"
          data-bs-dismiss="modal"
        >
          Close
        </button>
      }
    >
      <div className="text-center">

        <div
          className="display-1 text-danger"
        >
          !
        </div>

        <p className="mt-3">
          {message}
        </p>

      </div>
    </Modal>
  );
}

export default ErrorModal;
import Modal from "./Modal";

function SuccessModal({
  id,
  title = "Success",
  message,
}) {
  return (
    <Modal
      id={id}
      title={title}
      footer={
        <button
          className="btn btn-success"
          data-bs-dismiss="modal"
        >
          Close
        </button>
      }
    >
      <div className="text-center">

        <div
          className="display-1 text-success"
        >
          ✓
        </div>

        <p className="mt-3">
          {message}
        </p>

      </div>
    </Modal>
  );
}

export default SuccessModal;
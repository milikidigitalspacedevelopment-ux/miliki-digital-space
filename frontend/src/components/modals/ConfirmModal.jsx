import Modal from "./Modal";

function ConfirmModal({
  id,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
}) {
  return (
    <Modal
      id={id}
      title={title}
      footer={
        <>
          <button
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {cancelText}
          </button>

          <button
            className="btn btn-danger"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}

export default ConfirmModal;
import Modal from "./Modal";

function LoadingModal({
  id,
  message = "Please wait..."
}) {
  return (
    <Modal id={id} title="Processing">

      <div className="text-center py-4">

        <div
          className="spinner-border text-success"
        ></div>

        <p className="mt-4">
          {message}
        </p>

      </div>

    </Modal>
  );
}

export default LoadingModal;
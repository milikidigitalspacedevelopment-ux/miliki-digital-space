function ErrorState({
  message = "Something went wrong."
}) {
  return (
    <div className="alert alert-danger">
      {message}
    </div>
  );
}

export default ErrorState;
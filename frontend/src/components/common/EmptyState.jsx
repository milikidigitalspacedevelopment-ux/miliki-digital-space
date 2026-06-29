function EmptyState({
  message = "No data found."
}) {
  return (
    <div className="text-center py-5">
      <h5>{message}</h5>
    </div>
  );
}

export default EmptyState;
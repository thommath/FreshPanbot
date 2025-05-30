export default function PrintButtons() {
  return (
    <div className="flex">
      <button
        onClick={() =>
          fetch("/api/print", { method: "POST" }).then(
            () => window.location.href = "/admin/printQueue",
          )}
        className="bg-blue-500 px-3 py-2 rounded-lg text-white"
      >
        Print next
      </button>
      <button
        onClick={() =>
          fetch("/api/cancel", { method: "POST" }).then(
            () => window.location.href = "/admin/printQueue",
          )}
        className="bg-blue-500 px-3 py-2 rounded-lg text-white"
      >
        Cancel next
      </button>
    </div>
  );
}

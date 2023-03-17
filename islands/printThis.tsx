export type PrintThisProps = {
  str: string;
};

export default function PrintButtons(props: PrintThisProps) {
  return (
    <div className="flex">
      <button
        onClick={() =>
          fetch("/api/add", { method: "POST", body: props.str }).then(
            () => window.location.href = "/printQueue",
          )}
        className="bg-blue-500 px-3 py-2 rounded-lg text-white"
      >
        Add to queue
      </button>
    </div>
  );
}

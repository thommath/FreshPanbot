export type PrintThisProps = {
  str: string;
};

export default function PrintButtons(props: PrintThisProps) {
  return (
    <div className="flex">
      <button
        onClick={() =>
          fetch("/api/addPreset", { method: "POST", body: props.str }).then(
            () => window.location.href = "/"
          )}
        className="bg-blue-500 px-3 py-2 rounded-lg text-white"
      >
        Save as preset
      </button>
    </div>
  );
}

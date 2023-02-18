import { SIZE } from "./Drawing.tsx";
import { heart } from "../scripts/heart.ts";

const presets = [
  heart,
];

export default function Presets() {
    const handleUpload = (stroke: string) => {
      // code to handle uploading the strokes
      fetch("/api/add", {
        body: stroke,
        method: "POST",
      });
    };
  return (
    <>
      {presets.length &&
        (
          <div>
            {presets.map((str) => (
              <div onClick={() => handleUpload(str)} className="rounded-full h-64 w-64 bg-gray-300">
                <svg viewBox="0 0 100 100">
                  <path
                    d={str}
                    stroke-width={4 * SIZE / 100}
                    stroke-linecap="round"
                    style={{ fill: "none", stroke: "black" }}
                  >
                  </path>
                </svg>
              </div>
            ))}
          </div>
        )}
    </>
  );
};

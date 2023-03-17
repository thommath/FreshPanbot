import { SIZE } from "./Drawing.tsx";
import { heart } from "../scripts/heart.ts";
import Preview from "./Preview.tsx";

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
              <div
                onClick={() => handleUpload(str)}
              >
                <Preview
                  strokeSVG={str}
                  svgSize={SIZE}
                />
              </div>
            ))}
          </div>
        )}
    </>
  );
}

import { SIZE } from "./Drawing.tsx";
import { Preset } from "../routes/index.tsx";
import TouchContainer from "./TouchContainer.tsx";

export type PresetsProps = {
  presets: Preset[];
};

export default function Presets(props: PresetsProps) {
  const handleUpload = (stroke: string) => {
    // code to handle uploading the strokes
    fetch("/api/add", {
      body: stroke,
      method: "POST",
    }).then(
      () => window.location.href = "/admin/printQueue"
    );
  };
  const deletePreset = (id: string) => {
    // code to handle uploading the strokes
    fetch("/api/deletePreset", {
      body: id,
      method: "POST",
    }).then(
      () => window.location.href = "/"
    );
  };
  return (
    <>
      {props.presets.length !== 0 &&
        (
          <div>
            {props.presets.map((preset) => (
              <div>
                <div
                  onClick={() => handleUpload(preset.path)}
                >
                  <TouchContainer
                    strokeSVG={preset.path}
                    svgSize={SIZE}
                  />
                </div>
                <button onClick={() => deletePreset(preset.id)}>
                  Delete preset
                </button>
              </div>
            ))}
          </div>
        )}
        {props.presets.length === 0 && <div>No presets set</div>

        }
    </>
  );
}

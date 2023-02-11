import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  findPathFromImage,
  ImagePathOptions,
} from "../scripts/imageToCommands.ts";
import { SIZE } from "./Drawing.tsx";

declare namespace JSX {
  interface IntrinsicElements {
    "animateMotion": any;
  }
}

export default function ImageHandler() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [result, setResult] = useState<
    {
      path: string;
      intensityImage: string;
      clusterImage: string;
    } | null
  >(null);
  const [options, setOptions] = useState<ImagePathOptions>({
    imageUrl: "",
    colorDifference: 0.15,
    maxEdgeOverlap: 0.3,
    minimumNeighbours: 5,
    neighbourDistance: 2,
    resolution: 50,
    finalSize: (SIZE / 2) * Math.sqrt(2),
    offset: (SIZE - (SIZE / 2) * Math.sqrt(2))/2,
  });
  const [viewOptions, setViewOptions] = useState({
    animate: false,
    uploading: false,
  });

  useEffect(() => {
    if (!imageData) {
      return;
    }
    findPathFromImage({
      ...options,
      imageUrl: imageData.data,
    }).then(setResult);
  }, [imageData, options]);

  function uploadToPrinter() {
    if (!result) {
      return;
    }
    setViewOptions(options => ({...options, uploading: true}));
    fetch("/api/add", {
      body: result.path,
      method: "POST",
    }).then(discard);
  }

  function discard() {
    setResult(null);
    setImageData(null);
    setViewOptions({
      animate: false,
      uploading: false,
    });
  }

  return (
    <div class="flex gap-2 w-full flex-col">
      {!imageData && <FileUpload setImageData={setImageData} />}
      {result && (
        <div>
          <img class="w-6/12 inline-block" src={imageData.data} alt="" />
          <img class="w-6/12 inline-block" src={result.clusterImage} alt="" />
          <div
            style="width: 500px; height: 500px; position: relative;"
            class="m-auto"
          >
            <img
              class="w-full absolute left-0 top-0"
              src={result.intensityImage}
              alt=""
            />
            {viewOptions.animate &&
              (
                <svg
                  style="position: absolute;left: 0; top: 0"
                  width="500"
                  height="500"
                  viewBox="0 0 50 50"
                >
                  <circle r="1" fill="red">
                    <animateMotion
                      dur="20s"
                      repeatCount="indefinite"
                      path={result.path}
                    />
                  </circle>
                </svg>
              )}
          </div>
        </div>
      )}
      {imageData &&
        (
          <div class="flex gap-2 mx-2 justify-around text-center">
            <div>
              <label
                for="default-range"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Color threshold
              </label>
              <input
                id="default-range"
                type="range"
                min={0.01}
                max={0.3}
                step={0.01}
                value={options.colorDifference}
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                onChange={(el) =>
                  setOptions((options) => ({
                    ...options,
                    colorDifference: Number(el.currentTarget.value),
                  }))}
              />
            </div>
            <div>
              <label
                for="remove-background"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Remove background
              </label>
              <input
                id="remove-background"
                type="range"
                min={0.01}
                max={1}
                step={0.01}
                value={options.maxEdgeOverlap}
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                onChange={(el) =>
                  setOptions((options) => ({
                    ...options,
                    maxEdgeOverlap: Number(el.currentTarget.value),
                  }))}
              />
            </div>
            <div>
              <label
                for="neighbourDistance"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Neighbour distance
              </label>
              <input
                id="neighbourDistance"
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={options.neighbourDistance}
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                onChange={(el) =>
                  setOptions((options) => ({
                    ...options,
                    neighbourDistance: Number(el.currentTarget.value),
                  }))}
              />
            </div>
            <div>
              <label
                for="minimumNeighbours"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Minimum neighbours
              </label>
              <input
                id="minimumNeighbours"
                type="range"
                min={0}
                max={10}
                step={1}
                value={options.minimumNeighbours}
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                onChange={(el) =>
                  setOptions((options) => ({
                    ...options,
                    minimumNeighbours: Number(el.currentTarget.value),
                  }))}
              />
            </div>
            <div>
              <label
                for="resolution"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Resolution
              </label>
              <input
                id="resolution"
                type="range"
                min={10}
                max={100}
                step={5}
                value={options.resolution}
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                onChange={(el) =>
                  setOptions((options) => ({
                    ...options,
                    resolution: Number(el.currentTarget.value),
                  }))}
              />
            </div>
          </div>
        )}

      {imageData && (
        <div class="flex gap-8 justify-center">
          <div class="h-12 flex items-center">
            <input
              id="animate-checkbox"
              type="checkbox"
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) =>
                setViewOptions((options) => ({
                  ...options,
                  animate: e.currentTarget.checked,
                }))}
            />
            <label
              for="animate-checkbox"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Animate
            </label>
          </div>
          <div class="h-12 flex items-center">
            <button
              class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={discard}
            >
              Discard
            </button>
          </div>
          <div class="h-12 flex items-center">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              disabled={viewOptions.uploading}
              onClick={uploadToPrinter}
            >
              {viewOptions.uploading && <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                >
                </circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                >
                </path>
              </svg>}
              Upload to printer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ImageData {
  data: string;
  file: File | null;
}
interface FileUploadProps {
  setImageData: (data: ImageData) => void;
}

const FileUpload: FunctionalComponent<FileUploadProps> = (props) => {
  const handleDrop = (e: Event) => {
    e.preventDefault();
    const file: File | undefined = (e as any).dataTransfer?.files[0] ||
      (e.target as HTMLInputElement).files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        props.setImageData({
          data: event.target?.result as string,
          file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: Event) => {
    e.preventDefault();
  };

  const handleClick = (e: Event) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  return (
    <div
      className="relative h-64 border border-dashed border-gray-400 rounded-lg p-4 flex items-center justify-center text-gray-500 mx-auto w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div>
        <p className="text-center">
          Drag and drop an image file here or
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
          onClick={handleClick}
        >
          Click to browse
        </button>
        <input
          className="hidden"
          id="fileInput"
          type="file"
          onChange={handleDrop}
          accept="image/*"
        />
      </div>
    </div>
  );
};

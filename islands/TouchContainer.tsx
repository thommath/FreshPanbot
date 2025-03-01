import { useEffect, useMemo, useState } from "preact/hooks";
import { createRef, MouseEvent, TouchEvent } from "preact";
import { getStroke } from "npm:perfect-freehand@1.2.2";
import { convertToServerSize, type Stroke } from "./Drawing.tsx";

interface TouchContainerProps {
  onMouseMove: (position: { x: number; y: number; timeStamp: number, aspectRatio?: number }) => void;
  onMouseDown: (position: { x: number; y: number; timeStamp: number, aspectRatio?: number }) => void;
  onMouseUp: (position: { timeStamp: number }) => void;

  strokeSVG: string;
  strokes: Stroke[];
  svgSize: number;
  canvasRef?: any;
  interactive: boolean;
}

const topPercentage = 18;
const leftPercentage = 12;

const TouchContainer = ({
  onMouseMove,
  onMouseDown,
  onMouseUp,
  strokeSVG,
  strokes,
  svgSize,
  interactive,
}: TouchContainerProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = createRef<HTMLDivElement>();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (onMouseMove && isClicked) {
      onMouseMove(calculatePercentagePosition(e));
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (onMouseDown) {
      setIsClicked(true);
      onMouseDown(calculatePercentagePosition(e));
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (onMouseUp) {
      setIsClicked(false);
      onMouseUp(e);
    }
  };

  useEffect(() => {
    setIsClicked(false);
    onMouseUp({ timeStamp: 0 });
  }, [interactive]);

  const calculatePercentagePosition = (event: {
    clientX: number;
    clientY: number;
    timeStamp: number;
  }) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) {
      return { x: 0, y: 0, timeStamp: event.timeStamp };
    }

    const xPercentage =
      ((event.clientX - containerRect.left) / containerRect.width) * 100;
    const yPercentage =
      ((containerRect.bottom - event.clientY) / containerRect.height) * 100;

    console.log("Event: ", xPercentage, yPercentage)

    return { x: xPercentage, y: yPercentage, aspectRatio: containerRect.width / containerRect.height, timeStamp: event.timeStamp };
  };

  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const sizeToUse = width > height ? height : width;
    const scaledDown = sizeToUse * 0.85;
    setSize({
      width: scaledDown,
      height: scaledDown,
    });
  }, []);

  const serverSizeStrokes = useMemo(() =>
    strokes?.map(convertToServerSize), [strokes]);

  const paths = useMemo(() =>
    serverSizeStrokes?.map(stroke => getStroke(stroke, {
    }))?.map(getSvgPathFromStroke), [serverSizeStrokes]);

  const cirlces = useMemo(() =>
    serverSizeStrokes?.filter(a => a.length).map((stroke) => (
      <circle
        cx={stroke?.[0]?.x}
        cy={stroke?.[0]?.y}
        r={20}
        fill="black"
      />)) || <></>, [serverSizeStrokes]);

  return (
    <div className="full-width full-height">
      <div className="relative rounded-full bg-gray-300 mt-8" style={{ width: `${size.height}px`, height: `${size.height}px`, minHeight: '250px', minWidth: '250px' }}>
        <div
          className={`absolute top-[${topPercentage}%] h-[${100 - topPercentage * 2
            }%] left-[${leftPercentage}%] w-[${100 - leftPercentage * 2}%]`}
          ref={containerRef}
        >
          <svg
            className="border-1 border-black absolute top-0 left-0 h-full w-full"
            style="transform: scaleY(-1);"
            viewBox={`0 0 ${svgSize} ${svgSize / ((100 - leftPercentage * 2) / (100 - topPercentage * 2))
              }`}
          >
            {cirlces}
            {paths?.map((path) => (
              <path
                d={path}
                stroke-width={40}
                stroke-linecap="round"
                style={{ stroke: "black" }}
              >
              </path>
            ))}
            {strokeSVG && <path
              d={strokeSVG.slice(0, -4)}
              stroke-width={40}
              stroke-linecap="round"
              style={{ fill: "none", stroke: "black" }}
            >
            </path>}

          </svg>
          {containerRef && interactive && (
            <div
              className="absolute top-0 left-0 h-full w-full touch-none"
              onPointerDown={handleMouseDown}
              onPointerMove={handleMouseMove}
              onPointerUp={handleMouseUp}
              ref={containerRef}
              style={{
                touchAction: 'none'
              }}
            >
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const average = (a, b) => (a + b) / 2

function getSvgPathFromStroke(points, closed = true) {
  const len = points.length

  if (len < 4) {
    return ``
  }

  let a = points[0]
  let b = points[1]
  const c = points[2]

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i]
    b = points[i + 1]
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `
  }

  if (closed) {
    result += 'Z'
  }

  return result
}


export default TouchContainer;

import { useEffect, useState } from "preact/hooks";
import { createRef, MouseEvent, TouchEvent } from "preact";

interface TouchContainerProps {
  onMouseMove: (position: { x: number; y: number; timeStamp: number, aspectRatio?: number }) => void;
  onMouseDown: (position: { x: number; y: number; timeStamp: number, aspectRatio?: number }) => void;
  onMouseUp: (position: { timeStamp: number }) => void;

  strokeSVG: string;
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
    const scaledDown = sizeToUse * 0.8;
    setSize({
      width: scaledDown,
      height: scaledDown,
    });
  }, []);

  return (
    <div className="full-width full-height">
      <div className="relative rounded-full bg-gray-300 mt-8" style={{ width: `${size.height}px`, height: `${size.height}px` }}>
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
            <path
              d={strokeSVG.slice(0, -1)}
              stroke-width={40}
              stroke-linecap="round"
              style={{ fill: "none", stroke: "black" }}
            >
            </path>
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

export default TouchContainer;

import { useState } from "preact/hooks";
import { createRef, MouseEvent, TouchEvent } from "preact";

interface TouchContainerProps {
  onMouseMove: (position: { x: number; y: number; timeStamp: number }) => void;
  onMouseDown: (position: { x: number; y: number; timeStamp: number }) => void;
  onMouseUp: (position: { timeStamp: number }) => void;

  strokeSVG: string;
  svgSize: number;
  canvasRef?: any;
  interactive: boolean;
}

const topPercentage = 15;
const leftPercentage = 10;

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

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const mouseEvent = {
      ...e,
      clientX: touch.clientX,
      clientY: touch.clientY,
      offsetX: touch.pageX - e.currentTarget.getBoundingClientRect().left,
      offsetY: touch.pageY - e.currentTarget.getBoundingClientRect().top,
    } as any as MouseEvent<HTMLDivElement>;
    handleMouseMove(mouseEvent);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const mouseEvent = {
      ...e,
      clientX: touch.clientX,
      clientY: touch.clientY,
      offsetX: touch.pageX - e.currentTarget.getBoundingClientRect().left,
      offsetY: touch.pageY - e.currentTarget.getBoundingClientRect().top,
    } as any as MouseEvent<HTMLDivElement>;
    handleMouseDown(mouseEvent);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    handleMouseUp(e as any as MouseEvent<HTMLDivElement>);
  };

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

    return { x: xPercentage, y: yPercentage, aspectRatio: containerRect.width / containerRect.height, timeStamp: event.timeStamp };
  };

  return (
    <div className="relative rounded-full h-96 w-96 bg-gray-300 mt-8">
      <div
        className={`absolute top-[${topPercentage}%] h-[${100 - topPercentage * 2
          }%] left-[${leftPercentage}%] w-[${100 - leftPercentage * 2}%]`}
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
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            ref={containerRef}
            style={{
              touchAction: 'none'
            }}
          >
          </div>
        )}
      </div>
    </div>
  );
};

export default TouchContainer;

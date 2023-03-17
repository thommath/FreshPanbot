
export type PreviewProps = {
  strokeSVG: string;
  svgSize: number;
  callbacks?: {
    handleMouseDown: any;
    handleTouchStart: any;
  };
  canvasRef?: any;
};

const topPercentage = 15;
const leftPercentage = 10;

export default function Preview(props: PreviewProps) {
  return (
    <div className="relative rounded-full h-96 w-96 bg-gray-300 mt-8">
      <div
        className={`absolute top-[${topPercentage}%] h-[${
          100 - topPercentage * 2
        }%] left-[${leftPercentage}%] w-[${100 - leftPercentage * 2}%]`}
      >
        <svg
          className="border-1 border-black absolute top-0 left-0 h-full w-full"
          style="transform: scaleY(-1);"
          viewBox={`0 0 ${props.svgSize} ${
            props.svgSize / ((100 - leftPercentage*2) / (100 - topPercentage*2))
          }`}
        >
          <path
            d={props.strokeSVG.slice(0, -1)}
            stroke-width={40}
            stroke-linecap="round"
            style={{ fill: "none", stroke: "black" }}
          >
          </path>
        </svg>
        {props.canvasRef && props.callbacks && (
          <div
            className="absolute top-0 left-0 h-full w-full"
            onMouseDown={props.callbacks.handleMouseDown}
            onTouchStart={props.callbacks.handleTouchStart}
            ref={props.canvasRef}
          >
          </div>
        )}
      </div>
    </div>
  );
}

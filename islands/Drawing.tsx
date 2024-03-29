import { useEffect, useRef, useState } from "preact/hooks";
import Preview from "./Preview.tsx";

type Stroke = { x: number; y: number }[];

export const SIZE = 120 * 11;
export const DRAWING_SIZE = 50 * 11;

export default function DrawingComponent() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undoStack, setUndoStack] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDrawing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDrawing, currentStroke]);

  const normalizeInput = ({ x, y }: { x: number; y: number }) => {
    const boundingBox = (canvasRef.current as HTMLDivElement)
      .getBoundingClientRect();
    const canvasWidth = boundingBox.width;
    const canvasHeight = boundingBox.height;
    const aspectRatio = canvasWidth / canvasHeight;
    const movedX = x - boundingBox.left;
    const movedY = y - boundingBox.top;
    const normalizedX = Math.round((movedX / canvasWidth) * DRAWING_SIZE);
    const normalizedY = Math.round(
      (1-(movedY / canvasHeight)) * (DRAWING_SIZE / aspectRatio),
    );
    console.log(
      DRAWING_SIZE,
      DRAWING_SIZE / aspectRatio,
    )
    return { x: normalizedX, y: normalizedY };
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDrawing(true);
    e.stopPropagation();
    e.preventDefault();
    setCurrentStroke([normalizeInput({ x: e.clientX, y: e.clientY })]);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDrawing(true);
    e.stopPropagation();
    e.preventDefault();
    setCurrentStroke([
      normalizeInput({ x: e.touches[0].clientX, y: e.touches[0].clientY }),
    ]);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    e.stopPropagation();
    e.preventDefault();
    setCurrentStroke(
      (
        prevStroke,
      ) => [...prevStroke, normalizeInput({ x: e.clientX, y: e.clientY })],
    );
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDrawing) return;
    e.stopPropagation();
    e.preventDefault();
    setCurrentStroke(
      (prevStroke) => [
        ...prevStroke,
        normalizeInput({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }),
      ],
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setStrokes((
      prevStrokes,
    ) => [...prevStrokes, removeRepeatedPoints(currentStroke)]);
    setCurrentStroke([]);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    setStrokes((
      prevStrokes,
    ) => [...prevStrokes, removeRepeatedPoints(currentStroke)]);
    setCurrentStroke([]);
  };

  function removeRepeatedPoints(stroke: Stroke) {
    return stroke.filter((point, index) => {
      if (index === 0) {
        return true;
      }
      return point.x !== stroke[index - 1].x || point.y !== stroke[index - 1].y;
    });
  }

  const convertToServerSize = (s: Stroke) => {
    const scale = (n: number) => Math.round(n * (SIZE / DRAWING_SIZE));
    return s.map((v) => ({ x: scale(v.x), y: scale(v.y) }));
  };

  const convertStrokesToServerPath = (listOfStokes: Stroke[]) => {
    return listOfStokes.reduce(
      (acc, cur) => acc + " " + strokeToPath(convertToServerSize(cur)),
      "",
    ) + " Z";
  };

  const handleUpload = () => {
    // code to handle uploading the strokes
    fetch("/api/add", {
      body: convertStrokesToServerPath(strokes),
      method: "POST",
    }).then(
      () => window.location.href = "/printQueue"
    );
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    setUndoStack([...undoStack, strokes.pop() as Stroke]);
    setStrokes([...strokes]);
  };

  const handleRedo = () => {
    if (undoStack.length === 0) return;
    setStrokes([...strokes, undoStack.pop() as Stroke]);
    setRedoStack([...redoStack]);
  };

  const handleDiscard = () => {
    setStrokes([]);
    setRedoStack([]);
    setUndoStack([]);
  };

  const strokeToPath = (stroke: Stroke) => {
    return "M " + stroke.map((p) => `${p.x} ${p.y}`).join(" L ");
  };

  return (
    <div class="flex gap-2 w-full flex-col items-center">
      <Preview
        strokeSVG={convertStrokesToServerPath([...strokes, currentStroke])}
        svgSize={SIZE}
        callbacks={{
          handleMouseDown,
          handleTouchStart,
        }}
        canvasRef={canvasRef}
      />

      <div className="">
        <button
          className="bg-blue-500 px-3 py-2 rounded-lg text-white"
          onClick={handleUpload}
          disabled={strokes.length === 0}
        >
          Upload
        </button>
        <button
          className="bg-blue-500 px-3 py-2 rounded-lg text-white"
          onClick={handleDiscard}
          disabled={strokes.length === 0}
        >
          Discard
        </button>
        <button
          className="bg-blue-500 px-3 py-2 rounded-lg text-white"
          onClick={handleUndo}
          disabled={strokes.length === 0}
        >
          Undo
        </button>
        <button
          className="bg-blue-500 px-3 py-2 rounded-lg text-white"
          onClick={handleRedo}
          disabled={undoStack.length === 0}
        >
          Redo
        </button>
      </div>
    </div>
  );
}

import { useState, useCallback, useMemo, useEffect } from "preact/hooks";
import TouchContainer from "./TouchContainer.tsx";

type Point = { x: number; y: number };
type Stroke = Point[];

export const SIZE = 120 * 11;
export const DRAWING_SIZE = 50 * 11;

function removeRepeatedPoints(stroke: Stroke): Stroke {
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
const strokeToPath = (stroke: Stroke) => {
  return "M " + stroke.map((p) => `${p.x} ${p.y}`).join(" L ");
};

const calculateStrokeLength = (stroke: Stroke) => {
  return stroke.reduce((acc, cur, index) => {
    if (index === 0) return 0;
    return acc + Math.sqrt(
      Math.pow(cur.x - stroke[index - 1].x, 2) + Math.pow(cur.y - stroke[index - 1].y, 2),
    );
  }, 0);
};

const normalizeInput = ({ x, y, aspectRatio }: { x: number; y: number, aspectRatio?: number }): Point => {
  return {
    x: Math.round(x * DRAWING_SIZE / 100),
    y: Math.round(y * DRAWING_SIZE / (100 * (aspectRatio || 1))),
  }
  /*
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
  return { x: normalizedX, y: normalizedY };
  */
};

type Props = {
  setStrokeLength: (length: number) => void;
  setMaxLength: (length: number) => void;
};

export default function DrawingComponent({ setStrokeLength, setMaxLength }: Props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undoStack, setUndoStack] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);



  const handleMouseDown = useCallback((point: { x: number, y: number, aspectRatio?: number }) => {
    setIsDrawing(true);
    setCurrentStroke([normalizeInput(point)]);
  }, [strokes, currentStroke]);

  const handleMouseMove = (point: { x: number, y: number, aspectRatio?: number }) => {
    if (!isDrawing) return;

    setCurrentStroke(
      (
        prevStroke,
      ) => [...prevStroke, normalizeInput(point)],
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      setStrokes((
        prevStrokes: Stroke[],
      ) => [...prevStrokes, removeRepeatedPoints(currentStroke)]);
    }
    setCurrentStroke([]);
  };

  const handleUpload = () => {
    // code to handle uploading the strokes
    fetch("/api/add", {
      body: convertStrokesToServerPath([...strokes, currentStroke]),
      method: "POST",
    }).then(
      () => window.location.href = "/success"
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


  const maxLength = useMemo(() => 3000, []);
  const strokeLength = useMemo(() => strokes.reduce((acc, cur) => acc + calculateStrokeLength(cur), 0) + calculateStrokeLength(currentStroke), [strokes, currentStroke]);
  const maxLengthIsMet = useMemo(() => strokeLength > maxLength, [strokeLength, maxLength]);

  useEffect(() => {
    setStrokeLength(strokeLength);
    setMaxLength(maxLength);
  }, [strokeLength, maxLength]);

  return (
    <div class="flex gap-2 w-full flex-col items-center">
      <TouchContainer
        strokeSVG={convertStrokesToServerPath([...strokes, currentStroke])}
        svgSize={SIZE}
        interactive={!maxLengthIsMet}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />

      <div className="">
        <button
          className="bg-green-500 px-3 py-2 m-2 rounded-lg text-white"
          onClick={handleUpload}
          disabled={strokes.length === 0 && currentStroke.length === 0}
        >
          Print tegningen
        </button>
        <button
          className="bg-blue-500 px-3 py-2 m-2 rounded-lg text-white"
          onClick={handleDiscard}
          disabled={strokes.length === 0}
        >
          Restart
        </button>
        <button
          className="bg-blue-500 px-3 py-2 m-2 rounded-lg text-white"
          onClick={handleUndo}
          disabled={strokes.length === 0}
        >
          Angre
        </button>
        <button
          className="bg-blue-500 px-3 py-2 m-2 rounded-lg text-white"
          onClick={handleRedo}
          disabled={undoStack.length === 0}
        >
          Gjør om
        </button>
      </div>
    </div>
  );
}

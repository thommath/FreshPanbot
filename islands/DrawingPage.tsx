import { asset } from "$fresh/runtime.ts";
import { useState } from "preact/hooks/";
import DrawingComponent from "../islands/Drawing.tsx";
import { QueueInfo } from "../islands/QueueInfo.tsx";
import InkLevel from "./InkLevel.tsx";

export default function DrawingPage() {
    const [strokeLength, setStrokeLength] = useState(0);
    const [maxLength, setMaxLength] = useState(0);
    return (
        <>
            <div class="flex flex-row w-full min-h-full bg-yellow-100">
                <div className="flex flex-col justify-between">
                    <div>
                        <img src={asset("logo.png")} alt="" class="h-64" />
                        <h1 class="text-8xl">PanBot</h1>
                    </div>
                    <InkLevel currentLength={strokeLength} maxLength={maxLength} />
                </div>
                <div class="pt-8 bg-yellow-100 flex-grow-1">
                    <DrawingComponent setMaxLength={setMaxLength} setStrokeLength={setStrokeLength} />
                    <div className="text-center">
                        <QueueInfo />
                    </div>
                </div>

            </div>
        </>
    );
}

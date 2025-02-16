import { asset } from "$fresh/runtime.ts";

export default function Logo() {
    return (
        <div class="inline-flex items-center bg-yellow-100 justify-center">
            <img src={asset("logo.png")} alt="" class="h-64" />
            <h1 class="text-8xl">PanBot</h1>
        </div>);
}

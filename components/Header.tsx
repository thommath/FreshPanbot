import { asset } from "$fresh/runtime.ts";

export default function Header(props: { selectedTab: number }) {
  return (
    <>
      <div class="inline-flex items-center bg-yellow-100 justify-center">
        <img src={asset("logo.png")} alt="" class="h-64" />
      </div>
      <div class="flex justify-between">
        <a class="w-full" href="/">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${
              props.selectedTab === 0 ? "600" : "500"
            }`}
          >
            Preset
          </button>
        </a>
        <a class="w-full" href="/image">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${
              props.selectedTab === 1 ? "600" : "500"
            }`}
          >
            Image
          </button>
        </a>
        <a class="w-full" href="/drawing">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${
              props.selectedTab === 2 ? "600" : "500"
            }`}
          >
            Drawing
          </button>
        </a>
        <a class="w-full" href="/printQueue">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${
              props.selectedTab === 3 ? "600" : "500"
            }`}
          >
            Print queue
          </button>
        </a>
        <a class="w-full" href="/history">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${
              props.selectedTab === 3 ? "600" : "500"
            }`}
          >
            History
          </button>
        </a>
      </div>
    </>
  );
}

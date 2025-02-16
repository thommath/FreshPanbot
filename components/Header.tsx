import Logo from "./Logo.tsx";

export default function Header(props: { selectedTab: number }) {
  return (
    <>
      <Logo />
      <div class="flex justify-between">
        <a class="w-full" href="/admin">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 0 ? "600" : "500"
              }`}
          >
            Preset
          </button>
        </a>
        <a class="w-full" href="/admin/image">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 1 ? "600" : "500"
              }`}
          >
            Image
          </button>
        </a>
        <a class="w-full" href="/admin/drawing">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 2 ? "600" : "500"
              }`}
          >
            Drawing
          </button>
        </a>
        <a class="w-full" href="/admin/printQueue">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 3 ? "600" : "500"
              }`}
          >
            Print queue
          </button>
        </a>
        <a class="w-full" href="/admin/history">
          <button
            class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 3 ? "600" : "500"
              }`}
          >
            History
          </button>
        </a>
      </div>
    </>
  );
}

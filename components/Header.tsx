
export default function Header(props: { selectedTab: number }) {
  return (
    <>
      <h1 class="text-4xl text-center pb-4">Panbot</h1>
      <div class="flex justify-between">
        <a class="w-full" href="/">
          <button class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 0 ? '600' : '500'}`}>
            Preset
          </button>
        </a>
        <a class="w-full" href="/image">
          <button class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 1 ? '600' : '500'}`}>
            Image
          </button>
        </a>
        <a class="w-full" href="/drawing">
          <button class={`w-full p-2 bg-yellow-500 border-2 border-yellow-${props.selectedTab === 2 ? '600' : '500'}`}>
            Drawing
          </button>
        </a>
      </div>
    </>
  );
}

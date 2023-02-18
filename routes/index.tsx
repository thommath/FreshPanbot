import { Head, asset } from "$fresh/runtime.ts";
import Header from "../components/Header.tsx";
import Presets from "../islands/Presets.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Panbot</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="p-4 mx-auto max-w-screen-md flex flex-col align-top w-full min-h-full">
        <Header selectedTab={0} />
        <div class="bg-yellow-100 flex-grow-1">
          <Presets />
        </div>
      </div>
    </>
  );
}

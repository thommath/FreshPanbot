import { Head, asset } from "$fresh/runtime.ts";
import Header from "../../components/Header.tsx";
import ImageHandler from "../../islands/ImageHandler.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Panbot</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="flex flex-col w-full min-h-full">
        <Header selectedTab={1} />
        <div class="pt-8 bg-yellow-100 flex-grow-1">
          <ImageHandler />
        </div>
      </div>
    </>
  );
}

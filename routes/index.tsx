import { asset, Head } from "$fresh/runtime.ts";
import Logo from "../components/Logo.tsx";
import DrawingComponent from "../islands/Drawing.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Panbot</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="flex flex-col w-full min-h-full">
        <Logo />
        <div class="pt-8 bg-yellow-100 flex-grow-1 pb-64">
          <DrawingComponent />
        </div>
      </div>
    </>
  );
}

import { asset, Head } from "$fresh/runtime.ts";
import DrawingPage from "../islands/DrawingPage.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Panbot</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <DrawingPage />
    </>
  );
}

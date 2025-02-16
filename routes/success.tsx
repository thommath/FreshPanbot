import { asset, Head } from "$fresh/runtime.ts";
import Logo from "../components/Logo.tsx";
import { QueueInfo } from "../islands/QueueInfo.tsx";


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
          <div class="text-center">
            <h1 class="text-3xl font-bold m-1">
              Suksess! Tegningen din er lagt i kø for å bli tegnet.
            </h1>
            <QueueInfo />
            <div className="m-2">
              <a href="/">
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Tegn en ny tegning
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

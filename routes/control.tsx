import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import { redis, REDIS_QUEUE_KEY } from "./api/redis.ts";

interface PrinterQueue {
  items: string[];
}

export const handler: Handlers<PrinterQueue> = {
  async GET(_req, ctx) {
    const items = await (await redis).lrange(REDIS_QUEUE_KEY, 0, 10);
    return ctx.render({ items });
  },
};

export default function Home(props: PageProps<PrinterQueue>) {
  return (
    <>
      <Head>
        <title>Panbot</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="p-4 mx-auto max-w-screen-md flex flex-col align-top w-full min-h-full">
        <Header selectedTab={3} />
        <div class="bg-yellow-100 flex-grow-1">
          {props.data.items.length &&
            (
              <div>
                <div className="flex">
                  <button
                    onClick={() => fetch("/api/print", { method: "POST" })}
                    className="bg-blue-500 px-3 py-2 rounded-lg text-white"
                  >
                    Print next
                  </button>
                  <button
                    onClick={() => fetch("/api/cancel", { method: "POST" })}
                    className="bg-blue-500 px-3 py-2 rounded-lg text-white"
                  >
                    Cancel next
                  </button>
                </div>
                {props.data.items.map((str) => (
                  <div className="rounded-full h-64 w-64 bg-gray-300">
                    <svg viewBox="0 0 100 100">
                      <path
                        d={str}
                        stroke-linecap="round"
                        style={{ fill: "none", stroke: "black" }}
                      >
                      </path>
                    </svg>
                  </div>
                ))}
              </div>
            )}
          {!props.data.items.length && <div>No items in the print queue</div>}
        </div>
      </div>
    </>
  );
}

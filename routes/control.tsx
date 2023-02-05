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
  function print() {
    fetch("/api/print", { method: "POST"});
  }
  function cancel() {
    fetch("/api/cancel", { method: "POST"});
  }
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
                <button onClick={print}>Print next</button>
                <button onClick={cancel}>Cancel next</button>
                {props.data.items.map((str) => (
                  <div>
                    <svg viewBox="0 0 100 100">
                      <path d={str}></path>
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

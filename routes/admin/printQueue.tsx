import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../../components/Header.tsx";
import { SIZE } from "../../islands/Drawing.tsx";
import PrintButtons from "../../islands/printButtons.tsx";
import TouchContainer from "../../islands/TouchContainer.tsx";
import { redis, REDIS_HISTORY_KEY, REDIS_QUEUE_KEY } from "../../scripts/redis.ts";

interface PrinterQueue {
  history: string[];
  items: string[];
}

export const handler: Handlers<PrinterQueue> = {
  async GET(_req, ctx) {
    const history = await (await redis).lrange(REDIS_HISTORY_KEY, 0, 1);
    const items = await (await redis).lrange(REDIS_QUEUE_KEY, 0, 100);
    return ctx.render({ history, items });
  },
};

export default function Home(props: PageProps<PrinterQueue>) {
  return (
    <>
      <Head>
        <title>Panbot</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="flex flex-col w-full min-h-full">
        <Header selectedTab={3} />
        <div class="pt-8 bg-yellow-100 flex-grow-1 flex justify-center">
          <div class="flex flex-col">
            <h3 class="text-2xl">Last print</h3>
            <TouchContainer
              strokeSVG={props.data.history[0] || ""}
              svgSize={SIZE}
            />
            <h3 class="text-2xl">Printer queue</h3>
            {props.data.items.length !== 0 &&
              (
                <div>
                  <PrintButtons />
                  {props.data.items.map((str) => (
                    <TouchContainer
                      strokeSVG={str}
                      svgSize={SIZE}
                    />
                  ))}
                </div>
              )}
            {!props.data.items.length && <div>No items in the print queue</div>}
          </div>
        </div>
      </div>
    </>
  );
}

import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import { SIZE } from "../islands/Drawing.tsx";
import Preview from "../islands/Preview.tsx";
import PrintButtons from "../islands/printButtons.tsx";
import { redis, REDIS_HISTORY_KEY, REDIS_QUEUE_KEY } from "./api/redis.ts";

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
      <div class="p-4 mx-auto max-w-screen-md flex flex-col align-top w-full min-h-full">
        <Header selectedTab={3} />
        <div class="bg-yellow-100 flex-grow-1">
          <h3>Last print</h3>
          <Preview
            strokeSVG={props.data.history[0]}
            svgSize={SIZE}
          />
          <h3>Printer queue</h3>
          {props.data.items.length &&
            (
              <div>
                <PrintButtons />
                {props.data.items.map((str) => (
                  <Preview
                    strokeSVG={str}
                    svgSize={SIZE}
                  />
                ))}
              </div>
            )}
          {!props.data.items.length && <div>No items in the print queue</div>}
        </div>
      </div>
    </>
  );
}

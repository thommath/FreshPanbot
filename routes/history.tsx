import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import AddPreset from "../islands/addPreset.tsx";
import { SIZE } from "../islands/Drawing.tsx";
import Preview from "../islands/Preview.tsx";
import PrintThis from "../islands/printThis.tsx";
import { redis, REDIS_HISTORY_KEY } from "./api/redis.ts";

interface PrinterQueue {
  items: string[];
}

export const handler: Handlers<PrinterQueue> = {
  async GET(_req, ctx) {
    const items = await (await redis).lrange(REDIS_HISTORY_KEY, 0, 100);
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
      <div class="flex flex-col w-full min-h-full">
        <Header selectedTab={3} />
        <div class="pt-8 bg-yellow-100 flex-grow-1 flex justify-center">
          <div class="flex flex-col">
            {props.data.items.length !== 0 &&
              (
                <div>
                  {props.data.items.map((str) => (
                    <div>
                      <Preview
                        strokeSVG={str}
                        svgSize={SIZE}
                      />
                      <PrintThis str={str} />
                      <AddPreset str={str} />
                    </div>
                  ))}
                </div>
              )}
            {!props.data.items.length && <div>No items in history</div>}
          </div>
        </div>
      </div>
    </>
  );
}

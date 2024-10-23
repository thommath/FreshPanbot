import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import Presets from "../islands/Presets.tsx";
import { redis, REDIS_PRESET_KEY } from "./api/redis.ts";

export type Preset = {
  id: string;
  path: string;
};

interface PresetsData {
  presets: { [id: string]: Preset };
}

export const handler: Handlers<PresetsData> = {
  async GET(_req, ctx) {
    const presets = JSON.parse(
      //await (await redis).get(REDIS_PRESET_KEY) || "{}",
      "{}",
    );
    return ctx.render({ presets });
  },
};

export default function Home(props: PageProps<PresetsData>) {
  return (
    <>
      <Head>
        <title>Panbot</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div class="flex flex-col w-full min-h-full">
        <Header selectedTab={0} />
        <div class="pt-8 bg-yellow-100 flex-grow-1 flex justify-center">
          <div class="flex flex-col">
            <Presets presets={Object.values(props.data.presets)} />
          </div>
        </div>
      </div>
    </>
  );
}

//const presets = await (await redis).get(REDIS_PRESET_KEY) || {};

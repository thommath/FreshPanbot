import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_PRESET_KEY } from "../../scripts/redis.ts";

export const handler: Handlers = {
  async POST(req) {
    const presets = JSON.parse(await (await redis).get(REDIS_PRESET_KEY) || "{}");
    const id = Math.round(Math.random() * 100000000) + "";
    console.log("Adding ", id, "to preset");
    await (await redis).set(
      REDIS_PRESET_KEY,
      JSON.stringify({
        ...presets,
        [id]: {
          id,
          path: await req.text(),
        },
      }),
    );
    return new Response("ok");
  },
};

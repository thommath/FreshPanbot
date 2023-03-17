import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_PRESET_KEY } from "./redis.ts";

export const handler: Handlers = {
  async POST(req) {
    const presets = JSON.parse(await (await redis).get(REDIS_PRESET_KEY) || "{}");
    await (await redis).set(
      REDIS_PRESET_KEY,
      JSON.stringify({
        ...presets,
        [await req.text()]: undefined,
      }),
    );
    return new Response("ok");
  },
};

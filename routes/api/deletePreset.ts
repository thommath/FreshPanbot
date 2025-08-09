import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_PRESET_KEY } from "../../scripts/redis.ts";

export const handler: Handlers = {
  async POST(req) {
    const id = await req.text();
    console.log("Deleting ", id, "from preset");
    const presets = JSON.parse(await (await redis).get(REDIS_PRESET_KEY) || "{}");
    await (await redis).set(
      REDIS_PRESET_KEY,
      JSON.stringify({
        ...presets,
        [id]: undefined,
      }),
    );
    return new Response("ok");
  },
};

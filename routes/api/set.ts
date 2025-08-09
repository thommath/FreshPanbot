import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_QUEUE_KEY } from "../../scripts/redis.ts";

export const handler: Handlers = {
  async POST(req) {
    console.log("Deleting ", REDIS_QUEUE_KEY, " and adding one string");
    await (await redis).del(REDIS_QUEUE_KEY);
    await (await redis).lpush(REDIS_QUEUE_KEY, await req.text());
    return new Response("ok");
  },
};

import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_QUEUE_KEY } from "../../scripts/redis.ts";

export const handler: Handlers = {
  async POST(req) {
    console.log("Adding path to queue");
    await (await redis).rpush(REDIS_QUEUE_KEY, await req.text());
    return new Response("ok");
  }
};
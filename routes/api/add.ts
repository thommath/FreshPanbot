import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_QUEUE_KEY } from "./redis.ts";

export const handler: Handlers = {
  async POST(req) {
    await (await redis).rpush(REDIS_QUEUE_KEY, await req.text());
    return new Response("ok");
  }
};
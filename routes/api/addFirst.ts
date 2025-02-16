import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_QUEUE_KEY } from "./redis.ts";

export const handler: Handlers = {
  async POST(req) {
    console.log("Adding path first to queue");
    await (await redis).lpush(REDIS_QUEUE_KEY, await req.text());
    return new Response("ok");
  }
};
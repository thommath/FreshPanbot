import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_QUEUE_KEY } from "./redis.ts";

export const handler: Handlers = {
  async GET() {
    const text = await (await redis).lpop(REDIS_QUEUE_KEY);
    return new Response(text);
  }
};
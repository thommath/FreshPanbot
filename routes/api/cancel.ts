import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_QUEUE_KEY } from "./redis.ts";

export const handler: Handlers = {
  async POST() {
    const toPrint = await (await redis).lpop(REDIS_QUEUE_KEY);
    if (!toPrint) {
        return new Response("No items in queue", {status: 404});
    }
    return new Response("ok");
  }
};

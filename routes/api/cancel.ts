import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_HISTORY_KEY, REDIS_QUEUE_KEY } from "./redis.ts";

export const handler: Handlers = {
  async POST() {
    const toPrint = await (await redis).lpop(REDIS_QUEUE_KEY);
    if (!toPrint) {
        return new Response("No items in queue", {status: 404});
    }
    // Save it in history
    (await redis).lpush(REDIS_HISTORY_KEY, toPrint.toString());

    return new Response("ok");
  }
};

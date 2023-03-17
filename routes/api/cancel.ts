import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_HISTORY_KEY, REDIS_QUEUE_KEY } from "./redis.ts";

export const handler: Handlers = {
  async POST() {
    console.log("Cancel from queue");
    const toPrint = await (await redis).lpop(REDIS_QUEUE_KEY);
    if (!toPrint) {
      console.log("No items in queue");
      return new Response("No items in queue", { status: 404 });
    }
      console.log("adding canceled item to history");
      // Save it in history
    (await redis).lpush(REDIS_HISTORY_KEY, toPrint.toString());

    return new Response("ok");
  },
};

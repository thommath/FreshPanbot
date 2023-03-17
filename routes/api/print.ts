import { Handlers } from "$fresh/server.ts";
import {
  redis,
  REDIS_HISTORY_KEY,
  REDIS_QUEUE_KEY,
  REDIS_TO_PRINT_KEY,
} from "./redis.ts";

export const handler: Handlers = {
  async POST() {
    console.log("move from queue to print");
    const toPrint = await (await redis).lpop(REDIS_QUEUE_KEY);
    if (!toPrint) {
      console.log("no items in queue");
      return new Response("No items in queue", { status: 404 });
    }
    const printString = toPrint.toString();

    console.log("adding item to history and print queue");
    // Save it in history
    (await redis).lpush(REDIS_HISTORY_KEY, printString);

    // Send to print queue
    await (await redis).lpush(REDIS_TO_PRINT_KEY, printString);
    return new Response("ok");
  },
};

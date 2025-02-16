import { Handlers } from "$fresh/server.ts";
import {
  redis,
  REDIS_QUEUE_KEY,
} from "./redis.ts";

export const handler: Handlers = {
  async POST() {
    const queueLength = await (await redis).llen(REDIS_QUEUE_KEY);
    return new Response(queueLength.toString());
  },
};

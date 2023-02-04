import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_QUEUE_KEY } from "./redis.ts";

const timeout = 25;
const pull_interval = 100;
export const handler: Handlers = {
  async GET() {
    const getText = async () => await (await redis).lpop(REDIS_QUEUE_KEY);

    let text = null;
    for(let counter = 0; counter < (timeout*1000/pull_interval) && !text; counter++) {
        text = await getText();
        await new Promise(res => setTimeout(res, pull_interval));
    }
    return new Response(text);
  }
};
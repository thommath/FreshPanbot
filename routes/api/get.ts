import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_TO_PRINT_KEY } from "./redis.ts";

const timeout = 25;
const pull_interval = 100;
export const handler: Handlers = {
  async GET(...params) {
    const id = Math.round(Math.random()*100000);
    console.log(id, ": ", "get request received");
    const getText = async () => await (await redis).lpop(REDIS_TO_PRINT_KEY);

    console.log(JSON.stringify(params));

    let text = null;
    for (
      let counter = 0;
      counter < (timeout * 1000 / pull_interval) && !text;
      counter++
    ) {
      text = await getText();
      await new Promise((res) => setTimeout(res, pull_interval));
    }
      console.log(id, ": ", "returning ", text);
      return new Response(text);
  },
};

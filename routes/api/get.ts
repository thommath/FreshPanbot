import { Handlers } from "$fresh/server.ts";
import { redis, REDIS_TO_PRINT_KEY } from "../../scripts/redis.ts";

const timeout = 25;
const pull_interval = 100;

export const handler: Handlers = {
  async GET(req, ctx) {
    const id = Math.round(Math.random() * 100000);
    console.log(id, ": ", "get request received");

    const getText = async () => await (await redis).lpop(REDIS_TO_PRINT_KEY);

    const signal = req.signal;
    let text: string | null = null;

    try {
      for (
        let counter = 0;
        counter < (timeout * 1000 / pull_interval) && !text;
        counter++
      ) {
        if (signal.aborted) {
          console.log(id, ": ", "request aborted by client");
          return new Response("Request cancelled", { status: 499 });
        }

        text = await getText();
        if (text) break;

        await new Promise<void>((res, rej) => {
          const timeoutId = setTimeout(res, pull_interval);
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timeoutId);
              rej(new Error("aborted"));
            },
            { once: true },
          );
        });
      }

      console.log(id, ": ", "returning ", text);
      return new Response(text ?? "No data", { status: text ? 200 : 204 });
    } catch (err) {
      if (err.message === "aborted") {
        console.log(id, ": ", "aborted while waiting");
        return new Response("Request cancelled", { status: 499 });
      }
      console.error(id, ": ", "error", err);
      return new Response("Internal error", { status: 500 });
    }
  },
};

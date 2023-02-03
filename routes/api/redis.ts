import { HandlerContext } from "$fresh/server.ts";

import { connect } from "https://deno.land/x/redis/mod.ts";

export const handler = async (_req: Request, _ctx: HandlerContext): Response => {
  const redis = await connect({
    hostname: "redis.redis.svc.cluster.local",
    port: 6379,
  });
  const ok = await redis.set("hoge", "fuga");
  const fuga = await redis.get("hoge");
  
  return new Response(fuga);
};

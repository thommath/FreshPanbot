// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/api/add.ts";
import * as $2 from "./routes/api/cancel.ts";
import * as $3 from "./routes/api/get.ts";
import * as $4 from "./routes/api/joke.ts";
import * as $5 from "./routes/api/print.ts";
import * as $6 from "./routes/api/redis.ts";
import * as $7 from "./routes/api/set.ts";
import * as $8 from "./routes/control.tsx";
import * as $9 from "./routes/drawing.tsx";
import * as $10 from "./routes/image.tsx";
import * as $11 from "./routes/index.tsx";
import * as $$0 from "./islands/Counter.tsx";
import * as $$1 from "./islands/Drawing.tsx";
import * as $$2 from "./islands/ImageHandler.tsx";
import * as $$3 from "./islands/printButtons.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/api/add.ts": $1,
    "./routes/api/cancel.ts": $2,
    "./routes/api/get.ts": $3,
    "./routes/api/joke.ts": $4,
    "./routes/api/print.ts": $5,
    "./routes/api/redis.ts": $6,
    "./routes/api/set.ts": $7,
    "./routes/control.tsx": $8,
    "./routes/drawing.tsx": $9,
    "./routes/image.tsx": $10,
    "./routes/index.tsx": $11,
  },
  islands: {
    "./islands/Counter.tsx": $$0,
    "./islands/Drawing.tsx": $$1,
    "./islands/ImageHandler.tsx": $$2,
    "./islands/printButtons.tsx": $$3,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;

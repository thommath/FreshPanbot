// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $api_add from "./routes/api/add.ts";
import * as $api_addPreset from "./routes/api/addPreset.ts";
import * as $api_cancel from "./routes/api/cancel.ts";
import * as $api_deletePreset from "./routes/api/deletePreset.ts";
import * as $api_get from "./routes/api/get.ts";
import * as $api_print from "./routes/api/print.ts";
import * as $api_redis from "./routes/api/redis.ts";
import * as $api_set from "./routes/api/set.ts";
import * as $drawing from "./routes/drawing.tsx";
import * as $history from "./routes/history.tsx";
import * as $image from "./routes/image.tsx";
import * as $index from "./routes/index.tsx";
import * as $printQueue from "./routes/printQueue.tsx";
import * as $Drawing from "./islands/Drawing.tsx";
import * as $ImageHandler from "./islands/ImageHandler.tsx";
import * as $Presets from "./islands/Presets.tsx";
import * as $Preview from "./islands/Preview.tsx";
import * as $addPreset from "./islands/addPreset.tsx";
import * as $printButtons from "./islands/printButtons.tsx";
import * as $printThis from "./islands/printThis.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/api/add.ts": $api_add,
    "./routes/api/addPreset.ts": $api_addPreset,
    "./routes/api/cancel.ts": $api_cancel,
    "./routes/api/deletePreset.ts": $api_deletePreset,
    "./routes/api/get.ts": $api_get,
    "./routes/api/print.ts": $api_print,
    "./routes/api/redis.ts": $api_redis,
    "./routes/api/set.ts": $api_set,
    "./routes/drawing.tsx": $drawing,
    "./routes/history.tsx": $history,
    "./routes/image.tsx": $image,
    "./routes/index.tsx": $index,
    "./routes/printQueue.tsx": $printQueue,
  },
  islands: {
    "./islands/Drawing.tsx": $Drawing,
    "./islands/ImageHandler.tsx": $ImageHandler,
    "./islands/Presets.tsx": $Presets,
    "./islands/Preview.tsx": $Preview,
    "./islands/addPreset.tsx": $addPreset,
    "./islands/printButtons.tsx": $printButtons,
    "./islands/printThis.tsx": $printThis,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;

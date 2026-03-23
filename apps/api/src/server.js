import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { storeMode } from "./lib/store.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Mechnnovation API listening on http://localhost:${env.port} (${storeMode} mode)`);
});

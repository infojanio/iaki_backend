import { app } from "./app";
import { env } from "@/env";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("🚀 HTTP Server Local rodando na railway!");
  });

//  npm run start:dev

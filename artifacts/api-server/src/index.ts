import app from "./app";
import { logger } from "./lib/logger";

const port = Number(process.env.PORT) || 5000;

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });
}

export default app;

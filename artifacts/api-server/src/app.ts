import express, { type Express } from "express";
import cors from "cors";
import { type IncomingMessage, type ServerResponse } from "http";
import path from "node:path";
import { pinoHttp } from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const frontendDir = path.resolve(__dirname, "public");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(express.static(frontendDir, { index: false }));

app.get(/^\/opas-investor-deck(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(frontendDir, "opas-investor-deck", "index.html"));
});

app.get(/^\/opas-customer-deck(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(frontendDir, "opas-customer-deck", "index.html"));
});

app.get(/^\/opas-overview-deck(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(frontendDir, "opas-overview-deck", "index.html"));
});

app.get(/^\/(?!api(?:\/|$)).*$/, (req, res, next) => {
  if (path.extname(req.path)) {
    next();
    return;
  }

  res.sendFile(path.join(frontendDir, "index.html"));
});

export default app;

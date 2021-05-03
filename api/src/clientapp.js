import express from "express";
import clientApiRouter from "./clientapi/clientapi";
import tenantChecker from "./middleware/tenantchecker";
import { logRequest, logError } from "./middleware/logging";

const app = express();

// logging
app.use("/v1", logRequest);
app.use("/v1", logError);

// Setup CORS for client
// TODO: think about making it configurable, e.g. from environment
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.options("/*", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  res.send(200);
});

// Tenants
app.use("/v1", tenantChecker);

// We expect POST bodies to be JSON
app.use(express.json());

// Router
app.use("/v1", clientApiRouter);

// Statics
app.use("/assets", express.static("/svc/build/assets"));

export default app;

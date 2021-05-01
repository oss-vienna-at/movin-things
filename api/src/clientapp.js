/*
 * Main
 */
import express from "express";

const clientApp = express();
// Setup CORS for client
// TODO: think about making it configurable, e.g. from environment
clientApp.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
clientApp.options("/*", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  res.send(200);
});

// Middleware
import tenantChecker from "./middleware/tenantchecker";
clientApp.use("/v1", tenantChecker);

// We expect POST bodies to be JSON
clientApp.use(express.json());

// Router
import clientApiRouter from "./clientapi/clientapi";
clientApp.use("/v1", clientApiRouter);

// Statics
clientApp.use("/assets", express.static("/svc/build/assets"));

export default clientApp;

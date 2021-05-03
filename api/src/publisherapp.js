import express from "express";
import * as winston from "winston";
import publisherApiRouter from "./publisherapi/publisherapi";
import { logRequest, logError } from "./middleware/logging";

const app = express();

// logging
app.use("/v1", logRequest);
app.use("/v1", logError);

// We expect POST bodies to be JSON
app.use(express.json());

// router
app.use("/v1", publisherApiRouter);

export default app;

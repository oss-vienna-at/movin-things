import express from "express";

const publisherApp = express();

// We expect POST bodies to be JSON
publisherApp.use(express.json());

/*
 * Router
 * Possible TODO make routes adapter specific.
 */
import publisherApiRouter from "./publisherapi/publisherapi";
publisherApp.use("/v1", publisherApiRouter);

export default publisherApp;

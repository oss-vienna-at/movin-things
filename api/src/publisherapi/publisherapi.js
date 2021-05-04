import {logger} from "../middleware/logging";
import express from "express";
const publisherRouter = express.Router();
import { adapterMap } from "./../utils/config";
/*
 * Publisher REST API
 */

// publisher updates subscription
publisherRouter.post("/update/:adapter_id", function (req, res) {
  if (!req.params?.adapter_id) {
    logger.error("Update has no adapter id");
    return res.status(400).send("Bad Request\n").end();
  }
  adapterMap[req.params.adapter_id].normalize_published_payload(req.body);
  // expect an object like an NGSIv2 subscription update
  res.status(200).json("updated");
  // return res.json()
});

export default publisherRouter;

import {logger} from "../../middleware/logging";

class Adapter {
  constructor(config) {
    this.config = config;
    this.adapter_id = config.adapter_id;
    this.dtos = [];
  }

  static adaptersubscriptions = [];

  async subscribe(usage_id) {} // eslint-disable-line no-unused-vars

  normalize_published_payload(dataObjects) {
    logger.error("normalize_publish_payload called from Adapter parent class, unimplemented in concrete class, dataObjects = " + dataObjects);
  }
}

export default Adapter;

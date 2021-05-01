class Adapter {
  constructor(config) {
    this.config = config;
    this.adapter_id = config.adapter_id;
    this.dtos = [];
  }

  static adaptersubscriptions = [];

  async subscribe(usage_id) {} // eslint-disable-line no-unused-vars

  normalize_published_payload(dataObjects) {
    console.log("normalize_publish_payload dataObjects=", dataObjects);
  }
}

export default Adapter;

/*
 * Main
 */
import * as config from "./utils/config";

/*
 * Set up Express for two ports
 */

// in the handler, tenants will be in res.tenants
import appClient from "./clientapp";
import appPublisher from "./publisherapp";

/*
 * Listen on two ports
 */

// listen to CLIENT_PORT defined in process.env
appClient.listen(config.CLIENT_PORT, () =>
  console.log(`Backend listening on port ${config.CLIENT_PORT}!`)
);

// listen to PUBLISHER_PORT defined in process.env
appPublisher.listen(config.PUBLISHER_PORT, () =>
  console.log(`Backend listening on port ${config.PUBLISHER_PORT}!`)
);

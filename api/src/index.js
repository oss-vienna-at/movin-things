import * as config from "./utils/config";
import appClient from "./clientapp";
import appPublisher from "./publisherapp";
import {logger} from "./middleware/logging";

// listen to CLIENT_PORT defined in process.env
appClient.listen(config.CLIENT_PORT, () =>
  logger.info(`Backend listening on port ${config.CLIENT_PORT}!`)
);

// listen to PUBLISHER_PORT defined in process.env
appPublisher.listen(config.PUBLISHER_PORT, () =>
  logger.info(`Backend listening on port ${config.PUBLISHER_PORT}!`)
);

import express from "express";
const clientRouter = express.Router();
import { sortUnique } from "../lib/util";
import {
  tenantMap,
  configurationsMap,
  usageConfigs,
  subscriptionConfigs,
  adapterMap,
} from "./../utils/config";

const halfcircle=180.0;

const getUnrotatedValue = (rotated) => {
  const fullcircle=2*halfcircle;
  let unrotated=rotated%fullcircle;

  unrotated=( unrotated > halfcircle ) ? (unrotated-fullcircle) :
      (unrotated < (-halfcircle)) ? (unrotated+fullcircle) : unrotated

  return unrotated;
}

/*
 * Get DTOs inside mapbox
 */
const getDTOsInArea = (alldtos, maparea) => {
  let bottom=maparea[0][0];
  let top=maparea[1][0];
  let left=maparea[0][1];
  let right=maparea[1][1];
  left=getUnrotatedValue( left );
  right=getUnrotatedValue( right );

  let width=(right > left) ? ( right - left ) : ( (halfcircle + right) + (halfcircle - left) )
  let visible=[];
  visible=alldtos.reduce((insiders, point) => {
    if (
        bottom < point.geolocation[0] &&
        point.geolocation[0] < top &&
        (right - width) < point.geolocation[1] &&
        point.geolocation[1] < (left + width)
    ) {
      insiders.push(point);
    }
    return insiders;
  }, visible);
  return visible;
};

/*
 * Client REST API
 */

// gets a list of configurations available for tenant; currently unused
clientRouter.get("/get_configurations", (req, res) => {
  let tenants = res.tenants;
  let configurationNames = [];
  for (let tenant of tenants) {
    if (tenantMap[tenant]) {
      configurationNames.push(...tenantMap[tenant]);
    }
  }
  return res.json(sortUnique(configurationNames));
});

// gets map configuration for one configuration name
clientRouter.post("/init_component", (req, res) => {
  // check for post parameter
  let param = req.body;
  if (!param?.configuration_name) {
    return res.status(400).send("Bad Request\n");
  }

  let mapconfig = configurationsMap[param.configuration_name];
  let { usage_configs, ...stripconfig } = mapconfig;
  /* Solve adapter instance and parameters from configs
   * Possibilities are
   * -there are one or more subscription for same adapter
   * -there are subscriptions for different adapters
   * For every usage config create subscription request
   */
  usage_configs.forEach((usage) => {
    const subid = usageConfigs[usage].subscription_id;
    const adapterid = subscriptionConfigs[subid].adapter;
    // adapter might be disabled thus check is needed
    if (adapterMap[adapterid] !== undefined) {
      adapterMap[adapterid].subscribe(usage);
    }
  });

  // TODO: check, if following comments still apply
  // Check if there is subscription key for subscription id
  // If not then subscribe
  // Add received subscription id to adapter_subscription_id map
  return res.json(stripconfig);
});

// gets state of objects in boundary for configuration
clientRouter.post("/get_state", (req, res) => {
  // check for post parameter
  let param = req.body;
  if (!param?.configuration_name) {
    return res.status(400).send("Bad Request\n");
  }
  if (!param?.geo_bounding_box) {
    return res.status(400).send("Bad Request\n");
  }

  let flatdtos = [];

  let { usage_configs } = configurationsMap[param.configuration_name];
  usage_configs.forEach((usage) => {
    const subid = usageConfigs[usage].subscription_id;
    const adapterid = subscriptionConfigs[subid].adapter;
    // adapter might be disabled thus check is needed
    if (adapterMap[adapterid] !== undefined) {
      let usagedata = adapterMap[adapterid].dtos[usage];
      if (usagedata !== undefined && usagedata !== null) {
        flatdtos.push(usagedata);
      }
    }
  });
  flatdtos = flatdtos.flat();
  const returndtos = getDTOsInArea(flatdtos, param.geo_bounding_box.coords);
  return res.json(returndtos);
});

export default clientRouter;

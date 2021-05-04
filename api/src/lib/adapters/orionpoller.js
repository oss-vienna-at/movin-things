"use strict";
import {logger} from "../../middleware/logging";
import Adapter from "./adapter";
import request from "supertest";
import { usageConfigs } from "./../../utils/config";
import { getOmittedObjectValues } from "../util";

class orionPoller extends Adapter {
  constructor(config) {
    super(config);
    this.timer = false;
    this.timeoutID = undefined;
  }

  pollTimer(refthis) {
    if (refthis.timeoutID) {
      clearTimeout(refthis.timeoutID);
    }
    refthis.pollData(refthis);
    refthis.timeoutID = setTimeout(
      refthis.pollTimer,
      refthis.config.ms_timeout ? refthis.config.ms_timeout : 1000,
      refthis
    );
  }

  async subscribe(usage_id) {
    let inlist = this.dtos[usage_id];
    if (inlist === undefined) {
      this.dtos[usage_id] = null;
      if (!this.timer) {
        this.pollTimer(this);
        this.timer = true;
      }
    }
  }

  async pollData(refthis) {
    request(refthis.config.url)
      .get("")
      .set(refthis.config.headers)
      .then((result) => {
        if (result && result.body) {
          refthis.normalize_published_payload(refthis, result.body);
        }
      })
      .catch((what) => {
        logger.error("Can't poll error = " + what);
      });
  }

  normalize_published_payload(refthis, dataObjects) {
    let convertedobjects = dataObjects.map((item) => {
      let returnitem;
      if (item?.location) {
        let { location, ...rest } = item;
        returnitem = rest;
        let templocation;
        if (location.value) {
          templocation = location.value.coordinates;
        } else if (location.coordinates) {
          templocation = location.coordinates;
        } else {
          return item;
        }
        const temp = templocation[1];
        templocation[1] = templocation[0];
        templocation[0] = temp;
        returnitem["geolocation"] = templocation;
      } else {
        returnitem = item;
      }
      return returnitem;
    });
    Object.keys(refthis.dtos).forEach((usageid) => {
      refthis.dtos[usageid] = undefined;
      const omitvalues = usageConfigs[usageid].omit;
      const timestampvalues = usageConfigs[usageid].timestamps;
      refthis.dtos[usageid] = getOmittedObjectValues(
        convertedobjects,
        omitvalues,
        timestampvalues
      );
    });
  }
}

export default orionPoller;

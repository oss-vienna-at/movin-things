import {logger} from "../../middleware/logging";
import Adapter from "./adapter";
import request from "supertest";
import { usageConfigs } from "./../../utils/config";
import { getOmittedObjectValues } from "../util";

class demoAdapter extends Adapter {
  constructor(config) {
    super(config);
    if (this.config?.notification.http.url) {
      this.notification = this.config.notification.http.url;
    }

    this.demoobjects = [];
    this.demotimer = false;
    this.createDemoDTOs(this);
  }

  /* subscriptionkey and usage_id and list of dtos
   * usage_id is used for omitting values
   */
  static adaptersubscriptions = [];

  createDemoDTOs(refthis) {
    const randomstart = [48.199278, 16.343366];
    for (let i = 0; i < 3; i++) {
      const lat = randomstart[0] + (Math.random() - 0.5) / 10;
      const lng = randomstart[1] + (Math.random() - 0.5) / 10;
      const demodate = Date.now();
      const newdto = {
        id: `demoid_${i}`,
        type: "Scooter",
        name: `demoflyer_${i}`,
        remove: `For ${i} filtered`,
        temperature: "50",
        dateObserved: demodate,
        speed: 40,
        battery: 80,
        geolocation: [lat, lng],
      };
      const exists = refthis.demoobjects.findIndex(
        (dto) => dto.id === newdto.id
      );
      if (exists < 0) {
        refthis.demoobjects.push(newdto);
      }
    }
  }

  async demomover(refthis, point) {
    refthis.demoobjects.forEach((dto) => {
      let addlat = (dto.speed + point) / 35000.1;
      let newspeed = dto.speed - point / 4;
      if (newspeed < 5) {
        newspeed = 44;
      }
      dto.speed = newspeed;
      dto.geolocation[0] += addlat;
      if (dto.geolocation[0] > 48.3) {
        dto.geolocation[0] = 47.9;
      }
    });
    /*
     * Update myself
     */
    refthis.selfpublish(refthis);

    setTimeout(() => {
      refthis.demomover(refthis, point);
    }, 1000);
  }

  async subscribe(usage_id) {
    let inlist = this.dtos[usage_id];
    if (inlist === undefined) {
      try {
        if (!this.demotimer) {
          await this.demomover(this, 4);
          this.demotimer = true;
        }
        this.dtos[usage_id] = null;
        this.createsubscription(usage_id);
      } catch (error) {
        // usage in dto structure but subscription failed
        this.dtos[usage_id] = undefined;
        logger.error("subscribe error = " + error);
      }
    }
  }

  createsubscription(usage_id) {
    let subscribekey = Math.floor(Math.random() * 123456789).toString();

    if (demoAdapter.adaptersubscriptions.length > 0) {
      let inlist = demoAdapter.adaptersubscriptions[subscribekey];
      while (inlist !== undefined) {
        subscribekey = Math.floor(Math.random() * 123456789).toString();
        inlist = demoAdapter.adaptersubscriptions[subscribekey];
      }
    }
    demoAdapter.adaptersubscriptions[subscribekey] = usage_id;
  }

  async selfpublish() {
    let senddata = { data: this.demoobjects };
    Object.keys(demoAdapter.adaptersubscriptions).forEach((element) => {
      senddata["subscriptionId"] = element;
      const userequest = request(this.notification); //('http://localhost:3001/v1/update')
      // noinspection JSUnusedLocalSymbols
      userequest
        .post("/")
        .send(senddata)
        .set(this.config.headers)
        // eslint-disable-next-line no-unused-vars
        .then((result) => {
          // TODO: check if this is intentional
        })
        .catch((what) => {
          logger.error("Can't update error = " + what);
        });
    });
  }

  normalize_published_payload(dataObjects) {
    let usageid = null;
    if (!dataObjects?.subscriptionId || !dataObjects?.data) {
      return;
    }

    usageid = demoAdapter.adaptersubscriptions[dataObjects.subscriptionId];
    const omitvalues = usageConfigs[usageid].omit;
    this.dtos[usageid] = getOmittedObjectValues(dataObjects.data, omitvalues);
  }
}

export default demoAdapter;

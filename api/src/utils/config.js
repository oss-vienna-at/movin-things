import tenantConfigs from "./../config/config.json";
import subscriptionConfigs from "./../config/subscription.json";
import adapterConfigs from "./../config/adapter.json";
import usageConfigs from "./../config/subscription_usage.json";

let tenantHeader = process.env.TENANT_HEADER; // eslint-disable-line no-undef
if (tenantConfigs?.tenant_header) {
  tenantHeader = tenantConfigs.tenant_header;
}

let tenantRegEx =
  "tenant\\(name=(\\w+,?)+(,name=(\\w+))?(,name=(\\w+))?(,name=(\\w+))?\\)";
if (tenantConfigs?.tenant_regex) {
  tenantRegEx = tenantConfigs.tenant_regex;
}

let tenantResultSkip = [];
if (tenantConfigs?.tenant_result_skip) {
  tenantResultSkip = tenantConfigs.tenant_result_skip;
}

let tenantDefault = "public";
if (tenantConfigs?.tenant_default) {
  tenantDefault = tenantConfigs.tenant_default;
}

let tenantMap = {
  tenants: {
    pace: ["simple", "fancy"],
    profirator: ["fancy", "demo"],
  },
};

if (tenantConfigs?.tenants) {
  tenantMap = tenantConfigs.tenants;
}

let configurationsMap = null;

if (tenantConfigs?.configurations) {
  configurationsMap = tenantConfigs.configurations;
}

let CLIENT_PORT = process.env.CLIENT_PORT; // eslint-disable-line no-undef
let PUBLISHER_PORT = process.env.PUBLISHER_PORT; // eslint-disable-line no-undef

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "test") {
  PUBLISHER_PORT = process.env.TEST_PUBLISHER_PORT; // eslint-disable-line no-undef
}

import adapters from "./../lib/adapterloader";

let adapterMap;

// Using IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    adapterMap = await adapters(); // returns promise
  } catch (error) {
    console.log("error=", error);
  }
})();

//adapterMap is sort of class factory which is used to create new adapters for
// {tenant config usage adapter} structure
let dynamicAdaoterMap;

export {
  PUBLISHER_PORT,
  CLIENT_PORT,
  tenantHeader,
  tenantRegEx,
  tenantResultSkip,
  tenantDefault,
  tenantMap,
  configurationsMap,
  adapterConfigs,
  usageConfigs,
  subscriptionConfigs,
  adapterMap,
  dynamicAdaoterMap,
};

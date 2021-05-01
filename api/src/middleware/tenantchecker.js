import * as error from "../lib/errors";
import {
  tenantDefault,
  tenantHeader,
  tenantRegEx,
  tenantResultSkip,
} from "../utils/config";

let tenantRx = new RegExp(tenantRegEx);

// testable, must be exported
export function processTenantHeader(tenantHeaderValue) {
  if (!tenantHeaderValue || tenantHeaderValue.length < 1) {
    return [tenantDefault];
  }

  let match = tenantHeaderValue.match(tenantRx);
  if (!match) {
    return [tenantDefault];
  }
  let matched = match.filter((v) => {
    return (
      v &&
      tenantResultSkip.reduce(
        (accumulator, currentValue) => accumulator && !v.includes(currentValue),
        true
      )
    );
  });
  matched.sort();
  return matched;
}

// getTenants() extracts the list of tenants the client belongs to
export function getTenants(req) {
  let tenantHeaderValue = req.header(tenantHeader);
  return processTenantHeader(tenantHeaderValue);
}

const tenantChecker = function (req, res, next) {
  let tenants = getTenants(req);
  if (tenants.length === 0) {
    console.log(error.ERR_TENANT_HEADER_MISSING);
    return res.status(403).send("Forbidden\n");
  }
  res.tenants = tenants;
  next();
};

export default tenantChecker;

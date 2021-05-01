import { Env } from "@stencil/core";

const headeradd = Env.DEVHEADER;
const devheadervalue = Env.DEVVALUE;
let hostpath = Env.DEVBACKEND;

let apiheaders;

function setupApiHeaders(tenantlist: string): void {
  apiheaders = new Headers();
  const tenants = headeradd ? headeradd : "tenants";
  const tenantsvalue = headeradd
    ? devheadervalue + `tenants(list=${tenantlist});`
    : `(list=${tenantlist});`;
  apiheaders.append("Content-Type", "application/json");
  if (headeradd) {
    apiheaders.append(tenants, tenantsvalue);
  }
}

async function initComponent(
  setupLayers: (any) => void,
  onError: (string) => void,
  config: string,
  tenantlist: string,
  api?: string
): Promise<void> {
  hostpath = api ? api : hostpath;
  setupApiHeaders(tenantlist);
  const bodydata = `{"configuration_name": "${config}"}`;
  const request = new Request(`${hostpath}init_component`, {
    method: "POST",
    body: bodydata,
    headers: apiheaders,
  });
  try {
    const result = await fetch(request);
    if (result.ok) {
      const receivedData = await result.json();
      setupLayers(receivedData);
    }
  } catch (networkerror) {
    onError(networkerror);
  }
}

async function getState(
  placeDTOs: (any) => void,
  onError: (string) => void,
  geoboundingbox: [number[], number[]],
  config: string
): Promise<void> {
  const stringedbounds = JSON.stringify(geoboundingbox);
  const bodydata = `{"configuration_name": "${config}",
  "geo_bounding_box": {"coords": ${stringedbounds}}}`;
  const request = new Request(`${hostpath}get_state`, {
    method: "POST",
    body: bodydata,
    headers: apiheaders,
    keepalive: false,
    cache: "no-store",
  });
  try {
    const result = await fetch(request);
    if (result.ok) {
      const receivedData = await result.json();
      placeDTOs(receivedData);
    }
  } catch (networkerror) {
    onError(networkerror);
  }
}

export { getState, initComponent };

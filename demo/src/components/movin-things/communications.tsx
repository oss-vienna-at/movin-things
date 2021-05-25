let hostpath, apiheaders;

function setupApiHeaders(): void {
  apiheaders = new Headers();
  apiheaders.append("Content-Type", "application/json");
}

async function initComponent(
  setupLayers: (any) => void,
  onError: (string) => void,
  config: string,
  api?: string
): Promise<void> {
  hostpath = api ? api : hostpath;
  setupApiHeaders();
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

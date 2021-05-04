import { adapterConfigs } from "./../utils/config";
import {logger} from "../middleware/logging";

const useconfig = async (config) => {
  return config;
};

const loadAdapter = async (adapterconf) => {
  let { filename, ...strippedconfig } = adapterconf;
  return await Promise.all([
    useconfig(strippedconfig),
    import(`./adapters/${filename}`),
  ]);
};

const getAdapters = async () => {
  let adapterlist;
  const adapters = adapterConfigs.configurations;
  try {
    let resultArray = await Promise.all(
      adapters.map((config) => {
        if (!config?.disabled) {
          return loadAdapter(config);
        }
        return null;
      })
    );
    resultArray = resultArray.filter((adapterclass) => {
      return adapterclass !== null;
    });
    adapterlist = resultArray.map((adapterclass) => {
      return new adapterclass[1].default(adapterclass[0]);
    });
  } catch (error) {
    logger.error("getAdapters error = " + error);
  }

  let mappedAdapterList = [];
  adapterlist.forEach((element) => {
    mappedAdapterList[element.adapter_id] = element;
  });

  return mappedAdapterList;
};

export default getAdapters;

import {logger} from "../middleware/logging";

export function sortUnique(arr) {
  if (arr.length === 0) return arr;
  arr = arr.sort(function (a, b) {
    return a * 1 - b * 1;
  });
  let ret = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    //Start loop at 1: arr[0] can never be a duplicate
    if (arr[i - 1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }
  return ret;
}

export function getOmittedObjectValues(fullobject, omitlist, timestamplist) {
  let shrinkedobject = fullobject;
  if (timestamplist !== undefined) {
    shrinkedobject = shrinkedobject.map((oneitem) => {
      for (let ts of timestamplist) {
        let attr = ts.attr;
        let locale = ts.locale;
        let tz = ts.tz;
        if (oneitem[attr]) {
          try {
            let d = new Date(0);
            d.setSeconds(parseInt(oneitem[attr], 10));
            oneitem[attr] = new Intl.DateTimeFormat(locale, {
              dateStyle: "short",
              timeZone: tz,
              timeStyle: "short",
            }).format(d);
          } catch (e) {
            logger.error(e);
          }
        }
      }
      return oneitem;
    });
  }
  if (omitlist !== undefined) {
    shrinkedobject = shrinkedobject.map((oneitem) => {
      return Object.fromEntries(
        Object.entries(oneitem).filter(([key]) => {
          return !omitlist.includes(key);
        })
      );
    });
  }
  return shrinkedobject;
}

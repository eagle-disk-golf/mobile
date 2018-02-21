/** toArray maps through property names and returns an array containing values of object's properties. */
export const toArray = (obj) => Object.keys(obj).map(key => { return { ...obj[key] }; });
/** reverseArray maps through item and index and returns a new reversed array. */
export const reverseArray = (array) => array.map((item, idx) => array[array.length - 1 - idx]);

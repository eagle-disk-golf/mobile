export const toArray = (obj) => Object.keys(obj).map(key => {return {...obj[key]};});
export const reverseArray = (array) => array.map((item, idx) => array[array.length - 1 - idx]);

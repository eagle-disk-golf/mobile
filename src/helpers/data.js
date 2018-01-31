export const toArray = (obj) => Object.keys(obj).map(key => {return {...obj[key]};}).reverse();

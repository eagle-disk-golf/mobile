// if only one style object, place it inside array
export const stylesToArray = (styles) => styles ? Array.isArray(styles) ? styles : [styles] : [];
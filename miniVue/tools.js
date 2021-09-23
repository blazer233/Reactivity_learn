export const isObject = target => typeof target === "object" && target !== null;
export const isReactive = target => !!(target && target.__isReactive);
export const isRef = value => !!(value && value.__isRef);
export const isFunction = target => typeof target === "function";
export const hasChanged = (oldValue, value) =>
  oldValue != value && !(isNaN(oldValue) && isNaN(value));

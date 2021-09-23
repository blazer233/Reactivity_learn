import { track, trigger } from "./effect.js";
import { isObject } from "../tools.js";
export function reactive(target) {
  if (!isObject(target)) return target;
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      return isObject(res) ? reactive(res) : res;
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return res;
    }
  });
  return proxy;
}

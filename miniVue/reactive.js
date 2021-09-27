import { track, trigger } from "./effect.js";
import { hasChanged, isReactive, isObject } from "./tools.js";
const proxyMap = new WeakMap();
/**
 * 边界问题
 *  1、重复依赖收集 reactive(reactive(obj))
 *  2、重复代理 let tmp = reactive(obj) , tmp1 = reactive(obj)
 *  3、确认发生改变时 tmp.count = 10 tmp.count = 10 (再次赋值不会触发)
 *  4、深层对象依赖收集
 *  5、数组//length属性也是需要依赖收集，这里手动收集
 */

export function reactive(target) {
  if (!isObject(target) || isReactive(target)) return target; //如果已经被收集过直接返回(1
  if (proxyMap.has(target)) return proxyMap.get(target); //解决重复代理问题(2

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === "__isReactive") return true; //添加特征属性(1
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      return isObject(res) ? reactive(res) : res; //递归解决深层对象依赖收集(4
    },
    set(target, key, value, receiver) {
      let oldLength = target.length; //拿到原始的数组长度(5
      const oldValue = target[key]; //拿到原始的值(3
      const res = Reflect.set(target, key, value, receiver);
      //如果新旧值发生改变(3
      if (hasChanged(oldValue, value)) {
        trigger(target, key);
        //如果对象是数组，且长度发生改变再手动触发一次修改length属性(5
        if (Array.isArray(target) && hasChanged(oldLength, target.length)) {
          trigger(target, "length");
        }
      }
      return res;
    }
  });
  proxyMap.set(target, proxy); //解决重复代理问题(2
  return proxy;
}

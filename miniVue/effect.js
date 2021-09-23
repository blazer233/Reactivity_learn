const effectStack = [];
const targetMap = new WeakMap(); //依赖和副作用建立关系
/**
 *
 * target：reactive 返回的observed
 * key：observed 中对应的键
 * new Set(): 存储的副作用
 *
 * {
 *    [target]:{
 *      [key]:new Set()
 *    }
 * }
 */
let activeEffect;

export function effect(fn, options = {}) {
  const effectFn = () => {
    try {
      activeEffect = effectFn; //全局变量记录当前正在执行的副作用函数
      effectStack.push(activeEffect);
      return fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  !options.lazy && effectFn(); //不存在lazy时执行
  effectFn.scheduler = options.scheduler;
  return effectFn;
}
/**
 *
 * @param {Object} target 被收集依赖的对象
 * @param {*} key 收集依赖的key
 * @returns
 */
export function track(target, key) {
  if (!activeEffect) return;
  //存储依赖
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let deps = depsMap.get(key);
  if (!deps) depsMap.set(key, (deps = new Set()));
  deps.add(activeEffect);
}

export function trigger(target, key) {
  //获取对应依赖
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  if (!deps) return;
  deps.forEach(effectFn =>
    effectFn.scheduler ? effectFn.scheduler(effectFn) : effectFn()
  );
}

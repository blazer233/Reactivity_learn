const targetMap = new WeakMap(); //依赖和副作用建立关系
/**
 *
 * target：reactive 返回的observed
 * key：observed 中对应的键
 * new Set(): 存储的副作用
 *
 * {
 *    [target]:{
 *      [key]:new Set() [effect1,effect2...]
 *    }
 * }
 * 
 * 
 * const logCount = () => console.log(observed.count)
 * 
    function effect(fn) {
      const wrapped = () => {
        activeEffect = fn
        fn()
      }
      return wrapped
    }


    const wrappedLog = wrapper(logCount)
    wrappedLog()

    logCount函数打印observed.count的值，通过包装，将logCount函数赋给activeEffect
    track时activeEffect被收集到key对应的Set中，当对象的key改变时再次触发activeEffect
    即触发logCount
 * 
 */
let activeEffect;
export function effect(fn) {
  const reactiveEffect = () => {
    try {
      activeEffect = reactiveEffect; //全局变量记录当前正在执行的用户副作用函数
      return fn();
    } finally {
      activeEffect = undefined;
    }
  };
  reactiveEffect();
  return reactiveEffect;
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
  deps.forEach(reactiveEffect => {
    reactiveEffect(); //触发更新时，寻找对应的effect执行
  });
}

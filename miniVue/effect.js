const effectStack = [];
const targetMap = new WeakMap();
let activeEffect;

export function effect(fn, options = {}) {
  const effectFn = () => {
    try {
      /**
       * 1、嵌套effect
       * 嵌套effect执行时，第一次执行activeEffect为外层的函数的，
       * 执行到fn时执行内层的effect，此时activeEffect被改写为内存的函数
       * 外层的activeEffect被清空，所以使用栈的结构进行存贮
       */
      activeEffect = effectFn; //全局变量记录当前正在执行的副作用函数
      effectStack.push(activeEffect); //数组进行记录(1
      return fn();
    } finally {
      effectStack.pop(); //删除最后一个(1
      activeEffect = effectStack[effectStack.length - 1]; //拿到上一个存储的activeEffect(1
    }
  };
  !options.lazy && effectFn(); //是否第一次就执行
  effectFn.scheduler = options.scheduler; //存在调度时将调度挂在effectFn
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
    /**
     * 如果有调度程序先执行调度程序,否则再去执行副作用函数
     */
    effectFn.scheduler ? effectFn.scheduler(effectFn) : effectFn()
  );
}

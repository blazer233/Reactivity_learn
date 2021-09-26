let activeEffect;
// 定义一个 Dep 类，该类将会为每一个响应式对象的每一个键生成一个发布者实例 记录
class Dep {
  subscribers = new Set();
  // 构造函数接受一个初始化的值放在私有变量内
  constructor(value) {
    this._value = value;
  }
  // 当使用 xxx.value 获取对象上的 value 值时
  get value() {
    // 代理模式 当获取对象上的value属性的值时将会触发 depend 方法
    this.depend();
    // 然后返回私有变量内的值
    return this._value;
  }
  // 当使用 xxx.value = xxx 修改对象上的 value 值时
  set value(value) {
    // 代理模式 当修改对象上的value属性的值时将会触发 notify 方法
    this._value = value;
    // 先改值再触发 这样保证触发的时候用到的都是已经修改后的新值
    this.notify();
  }

  //依赖收集
  depend() {
    // 如果 activeEffect 这个变量为空 就证明不是在 watchEffect 这个函数里面触发的 get 操作
    if (activeEffect) {
      // 但如果 activeEffect 不为空就证明是在 watchEffect 里触发的 get 操作
      // 那就把 activeEffect 这个存着 watchEffect 参数的变量添加进缓存列表中
      this.subscribers.add(activeEffect);
    }
  }

  // 更新操作 通常会在值被修改后调用
  notify() {
    // 遍历缓存列表里存放的函数 并依次触发执行
    this.subscribers.forEach(effect => {
      effect();
    });
  }
}

function watchEffect(effect) {
  // 先把传进来的函数放入到 activeEffect 这个变量中
  activeEffect = effect;
  // 然后执行 watchEffect 里面的函数
  effect();
  // 最后把 activeEffect 置为空值
  activeEffect = null;
}


const targetToHashMap = new WeakMap();

function getDep(target, key) {
  let depMap = targetToHashMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetToHashMap.set(target, depMap);
  }

  let dep = depMap.get(key);
  if (!dep) {
    dep = new Dep(target[key]);
    depMap.set(key, dep);
  }

  return dep;
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      const value = getDep(target, key).value;
      if (value && typeof value === "object") {
        return reactive(value);
      } else {
        return value;
      }
    },
    set(target, key, value) {
      getDep(target, key).value = value;
    }
  };);
}

const state = reactive({
  count: 0
});

watchEffect(() => {
  console.log(state.count);
}); // 0

state.count++; // 1

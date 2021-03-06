import { isFunction } from "./tools.js";
import { effect, track, trigger } from "./effect.js";

export function computed(getterOrOption) {
  let getter, setter;
  if (isFunction(getterOrOption)) {
    getter = getterOrOption;
    setter = () => console.warn("computed is readonly");
  } else {
    getter = getterOrOption.get;
    setter = getterOrOption.set;
  }
  return new ComputedImpl(getter, setter);
}

class ComputedImpl {
  constructor(getter, setter) {
    this._setter = setter;
    this._value = undefined; //缓存
    this._dirty = true; //依赖是否更新
    this.effect = effect(getter, {
      lazy: true,
      //调度机制
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
          trigger(this, "value");
        }
      }
    }); //初始化effect
  }

  get value() {
    if (this._dirty) {
      this._value = this.effect(); //做getters
      this._dirty = false; //再取时不用进行计算
      track(this, "value");
    }
    return this._value; //返回值
  }

  set value(newValue) {
    this._setter(newValue);
  }
}

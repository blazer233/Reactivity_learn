import { hasChanged, isObject, isRef } from "./tools.js";
import { track, trigger } from "./effect.js";
import { reactive } from "./reactive.js";

export function ref(value) {
  if (isRef(value)) return value;
  return new RefImpl(value);
}

class RefImpl {
  constructor(value) {
    this.__isRef = true; //添加特征属性
    this._value = isObject(value) ? reactive(value) : value;
  }

  get value() {
    track(this, "value");
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._value)) {
      this._value = isObject(newValue) ? reactive(newValue) : newValue;
      trigger(this, "value");
    }
  }
}

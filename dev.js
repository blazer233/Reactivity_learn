let activeEffect;

class Dep {
  subscribers = new Set();
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }
  notify() {
    this.subscribers.forEach(effect => effect());
  }
}

function watchEffect(effect) {
  activeEffect = effect;
  effect();
}

// usage -----------------------

const dep = new Dep();

let actualCount = 0;
const state = {
  get count() {
    dep.depend();
    return actualCount;
  },
  set count(newCount) {
    actualCount = newCount;
    dep.notify();
  }
};

watchEffect(() => {
  console.log(state.count, state, "watchEffect");
}); // 0

state.count++; // 1
state.count++; // 1
state.count++; // 1

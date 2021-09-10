class EventEmitter {
  constructor() {
    this.subscribers = {};
  }
  on(key, fn) {
    let Events = [];
    Events.push(fn);
    this.subscribers[key] = Events;
  }
  emit(key, ...arg) {
    let Events = this.subscribers[key];
    if (Events.length) {
      Events.forEach(i => i(...arg));
    }
  }
}


function handleOne(a, b, c) {
  console.log("第一个监听函数", a, b, c);
}

emitter.on("demo", handleOne);

emitter.emit("demo", 1, 2, 3);

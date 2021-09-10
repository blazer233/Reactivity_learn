class EventEmitter {
  constructor() {
    this.obj = {};
  }
  on(key, fn) {
    let Events = [];
    Events.push(fn);
    this.obj[key] = Events;
  }
  emit(key, ...arg) {
    let Events = this.obj[key];
    if (Events.length) {
      Events.forEach(i => i(...arg));
    }
  }
}

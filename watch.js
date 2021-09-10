let handlers = {};
function watch(eventName, handler, context = null) {
  if (typeof handler !== "function") {
    throw new Error("watch param [handler] must be a function");
  }
  let event = handlers[eventName];
  if (!event) {
    event = handlers[eventName] = [];
  }
  event.push({ context: context, handler: handler });
}

function dispatch(eventName, ...data) {
  let event = handlers[eventName];
  if (event) {
    event.forEach(f => {
      try {
        f.handler.call(f.context, ...data);
      } catch (e) {
        console.error("watcher dispatch", eventName, e);
      }
    });
  }
}

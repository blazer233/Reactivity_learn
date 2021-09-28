# 手写 vue3核心 实现effect、reactive、ref、computed 🎅

## 前言 📝

> 👉 [unstated-next](https://github.com/jamiebuilds/unstated-next) 基于 React 心智模型(hook+context)而设计的状态管理。 👈

![Alt](https://raw.githubusercontent.com/blazer233/unstated-next/main/public/temp1.jpg)

在 react hook 出现之前，有基于单一数据源，使用纯函数修改状态的 redux & react-redux 也有基于 Object.defineProperty 和 Proxy 来进行数据拦截访问的 mobx ，但伴随着 react 16.8 的出现，我们可以基于自带的 hook 去实现状态管理也就是 unstated-next

---

## 官网 Demo 🥔

```javascript
...
import { createContainer } from "unstated-next";

function useCounter(initialState = 0) {
  let [count, setCount] = useState(initialState);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);
  return { count, decrement, increment };
}

//使用 createContainer 将 useCounter改造成提供状态和方法的组件
let Counter = createContainer(useCounter);

function CounterDisplay() {
//从被处理过的 useCounter 中拿到状态和方法
  let counter = Counter.useContainer();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}

function App() {
  return (
    <Counter.Provider>
      <CounterDisplay />
      {/* 通过initialState属性注入初始值 */}
      <Counter.Provider initialState={2}>
            <CounterDisplay />
      </Counter.Provider>
    </Counter.Provider>
  );
}

render(<App />, document.getElementById("root"));
```

unstated-next 做了什么？

1. 提供 createContainer 将自定义 Hooks 封装为一个可以提供状态和方法的 **数据对象**
2. 利用 useContext 构造了 `Provider 注入` 和 `组件获取获取 Store` 这两个方法

---

## 实现一个 unstated-next 🚲

```javascript
import { createContext, createElement, useContext } from "react";
export default useHook => {
  const Context = createContext();
  const Provider = ({ init, children }) => {
    return createElement(Context.Provider, { value: useHook(init) }, children);
  };
  const useContainer = () => useContext(Context);
  return { Provider, useContainer };
};
```

- 通过函数返回一个包含`Provider`和`useContainer`的对象
- Provider 接受 init 初始值，去执行 **数据对象** 组件，通过 createElement 创造一个 Context.Provider 传值组件，并将 **数据对象** 组件返回的方法和状态保存到`value`，子节点不变，返回：

```javascript
<xxx.Provider value={方法，状态...}>{children}</xxx.Provider>
```

- 通过`useContainer`拿到 当前 Context.Provider 中的 value 状态和方法 并返回

---

## 如何解决 Provider hell 🏁

在 unstated-next 中每一个被处理为 **数据对象** 的组件如果想要被共享，需要在最外层逐级包裹

```javascript
<Container1.Provider>
  <Container2.Provider>
    <Container3.Provider>MyApp</Container3.Provider>
  </Container2.Provider>
</Container1.Provider>
```

我们可以通过 类似 compose 函数进行处理，将所有 **数据对象** 组件通过 reduce 逐级叠加返回一个类似洋葱的 Provider，调用的时候只需要使用`Provider`包裹住业务组件

```javascript
export const composeProvider =
  (...commonFun) =>
  ({ children }) => {
    return commonFun.reduceRight((child, { init, Provider }) => {
      return <Provider init={init}>{child}</Provider>;
    }, children);
  };

//进行调用
const Provider = reduceProvider({ ...xxxState1, init: 100 }, xxxState2);
export default () => (
  <Provider>
    <ExamplePage1 />
    <ExamplePage2 />
    <ExamplePage3 />
  </Provider>
);
```

[查看完整代码](https://github.com/blazer233/unstated-next)

大功告成！

## 总结 💢

总结

其实 unstated-next 实现很简单，通俗来讲就是一个闭包，使用于简单的业务场景，且写法过于灵活，一旦遇到 class 组件的情况，就又要回到旧的写法，所以只能说有利有弊

至此，谢谢各位在百忙之中点开这篇文章，希望对你们能有所帮助，相信你对 unstated-next 有了大概的认实，如有问题欢迎各位大佬指正。

欢迎添加我的微信共同讨论前端技术问题（备注：qian）

![Alt](<https://raw.githubusercontent.com/blazer233/unstated-next/main/public/1618833127(1).png>)

- 👋：[跳转 github](https://github.com/blazer233/unstated-next)

## 参考文献

- 🍑：[unstated-next](https://github.com/jamiebuilds/unstated-next)
- 🍑：[React hooks，组合与抽象，状态管理](https://zhuanlan.zhihu.com/p/114034495)
- 🍑：[精读《unstated 与 unstated-next 源码》](https://zhuanlan.zhihu.com/p/93500556)
- 🍑：[React 轻量状态管理库 unstated-next 使用教程](https://www.jianshu.com/p/f5d0d777b523)

求个 star，谢谢大家了

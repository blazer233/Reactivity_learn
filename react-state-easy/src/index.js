import React from "react";
import ReactDOM from "react-dom";
// import AppTodo from "./todo/App";
// import "./todo/index.css";
import AppClock from "./clock/App";
import "./clock/index.css";
// import AppBeer from "./beer-finder/App";
// import "./beer-finder/index.css";

console.time("timer");
ReactDOM.render(<AppClock />, document.getElementById("root"));

console.timeEnd("timer");

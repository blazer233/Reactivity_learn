import React, { useEffect, useState } from "react";
import moment from "moment";
import { view, store } from "@risingstack/react-easy-state";
const getFormattedTime = () => moment().format("hh:mm:ss A");

const ReactApp = () => {
  const [date, setDate] = useState(getFormattedTime());
  useEffect(() => {
    const id = setInterval(() => setDate(getFormattedTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{date}</div>;
};

const ReactAppEasy = view(() => {
  const clock = store({ time: getFormattedTime() });

  useEffect(() => {
    const id = setInterval(() => (clock.time = getFormattedTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{clock.time}</div>;
});

export default ReactApp;

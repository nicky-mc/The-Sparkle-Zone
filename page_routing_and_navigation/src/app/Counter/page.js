"use client";

import React, { useState } from "react";
import CounterButton from "../components/Counter";
import "./counter.css";

export default function CounterPage() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="counter-container">
      <h1 className="counter-title">Counter: {count}</h1>
      <CounterButton onClick={handleIncrement} />
    </div>
  );
}

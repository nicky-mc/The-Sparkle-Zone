"use client";
import { useState, useEffect } from "react";
import "./Counter.css"; // Add custom styling for Casio watch

export default function Counter() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClicker, setAutoClicker] = useState(0);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(60); // 60-second countdown

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + autoClicker);
      setTimer((prevTime) => prevTime + 1);
    }, 1000);

    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    }

    return () => clearInterval(interval);
  }, [autoClicker, countdown]);

  const handleClick = () => {
    setCount(count + multiplier);
  };

  const upgradeMultiplier = () => {
    if (count >= 100) {
      setCount(count - 100);
      setMultiplier(multiplier + 1);
    }
  };

  const buyAutoClicker = () => {
    if (count >= 200) {
      setCount(count - 200);
      setAutoClicker(autoClicker + 1);
    }
  };

  return (
    <div className="clicker-container">
      <h1 className="text-3xl font-bold mb-6">Clicker Game</h1>
      <button onClick={handleClick} className="click-button btn">
        Click Me
      </button>
      <p className="count-display">Count: {count}</p>
      <p>Multiplier: {multiplier}x</p>
      <p>Auto Clickers: {autoClicker}</p>
      <div className="upgrades">
        <button onClick={upgradeMultiplier} className="btn">
          Upgrade Multiplier (100)
        </button>
        <button onClick={buyAutoClicker} className="btn">
          Buy Auto Clicker (200)
        </button>
      </div>
      <div className="watch-container">
        <h2>Classic Casio Timer</h2>
        <p>Current Time: {new Date().toLocaleTimeString()}</p>
        <p>Game Timer: {timer}s</p>
        <p>Countdown: {countdown}s</p>
      </div>
    </div>
  );
}

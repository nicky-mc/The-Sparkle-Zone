"use client";
import React, { useState, useEffect, useRef } from "react";
import useOnClickOutside from "../../hooks/use-on-click-outside"; // Import the custom hook
import "./Counter.css"; // Add custom styling for Casio watch

export default function Counter() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClicker, setAutoClicker] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // Tracks time in milliseconds
  const [countdown, setCountdown] = useState(0); // Initialize countdown to 0
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false); // New state to track if countdown is active
  const [currentTime, setCurrentTime] = useState("");
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);
  const gameTimerRef = useRef(null);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    console.log("Clicked outside");
  });

  useEffect(() => {
    // Set the current time and date on the client side only in Casio style
    const updateTime = () => {
      const now = new Date();
      const dayOfWeek = now
        .toLocaleString("en-US", { weekday: "short" })
        .toUpperCase();
      const month = now
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      const day = String(now.getDate()).padStart(2, "0");
      const time = now.toLocaleTimeString();
      setCurrentTime(`${dayOfWeek} ${month} ${day} ${time}`);
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - timeElapsed; // Maintain elapsed time even when stopped
      intervalRef.current = setInterval(() => {
        setTimeElapsed(Date.now() - start);
      }, 10); // Update every 10ms for millisecond precision
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Format stopwatch time into hours, minutes, seconds, and milliseconds
  const formatStopwatchTime = () => {
    const milliseconds = Math.floor((timeElapsed % 1000) / 10); // Show hundredths of a second
    const totalSeconds = Math.floor(timeElapsed / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  };

  // Updated countdown effect to decrement input fields directly
  useEffect(() => {
    if (isCountdownActive && countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          const totalSeconds = prevCountdown - 1;

          // Calculate hours, minutes, and seconds from total seconds
          const newHours = Math.floor(totalSeconds / 3600);
          const newMinutes = Math.floor((totalSeconds % 3600) / 60);
          const newSeconds = totalSeconds % 60;

          // Update state for hours, minutes, and seconds
          setHours(newHours);
          setMinutes(newMinutes);
          setSeconds(newSeconds);

          return totalSeconds;
        });
      }, 1000);
    } else if (isCountdownActive && countdown === 0) {
      clearInterval(countdownRef.current);
      // Only trigger the alert once when the countdown hits 0
      alert("Time's up!");
      // Reset countdown state and active state
      setIsCountdownActive(false);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
    return () => clearInterval(countdownRef.current);
  }, [countdown, isCountdownActive]);

  useEffect(() => {
    const autoClickInterval = setInterval(() => {
      setCount((prevCount) => prevCount + autoClicker);
    }, 1000);
    return () => clearInterval(autoClickInterval);
  }, [autoClicker]);

  const handleClick = () => {
    setCount(count + multiplier);
    if (!gameTimerRef.current) {
      gameTimerRef.current = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1000);
      }, 1000);
    }
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

  const handleCountdownStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setCountdown(totalSeconds);
    setIsCountdownActive(true); // Set countdown as active when starting
  };

  const handleCountdownReset = () => {
    clearInterval(countdownRef.current);
    setCountdown(0);
    setIsCountdownActive(false); // Stop countdown
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    clearInterval(gameTimerRef.current);
    gameTimerRef.current = null;
  };

  const increment = (setter, max) => () => setter((prev) => (prev + 1) % max);
  const decrement = (setter, max) => () =>
    setter((prev) => (prev - 1 + max) % max);

  return (
    <div className="clicker-container" ref={ref}>
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
        <p>Current Time: {currentTime}</p>
        <p>Game Timer: {Math.floor(timeElapsed / 1000)}s</p>
        <div className="countdown-inputs">
          <div className="input-group">
            <input
              type="number"
              value={String(hours).padStart(2, "0")}
              onChange={(e) => setHours(parseInt(e.target.value, 10) || 0)}
              className="digital-input"
            />
            <div className="button-group">
              <button onClick={increment(setHours, 24)} className="btn-small">
                +
              </button>
              <button onClick={decrement(setHours, 24)} className="btn-small">
                -
              </button>
            </div>
          </div>
          <span>:</span>
          <div className="input-group">
            <input
              type="number"
              value={String(minutes).padStart(2, "0")}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
              className="digital-input"
            />
            <div className="button-group">
              <button onClick={increment(setMinutes, 60)} className="btn-small">
                +
              </button>
              <button onClick={decrement(setMinutes, 60)} className="btn-small">
                -
              </button>
            </div>
          </div>
          <span>:</span>
          <div className="input-group">
            <input
              type="number"
              value={String(seconds).padStart(2, "0")}
              onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
              className="digital-input"
            />
            <div className="button-group">
              <button onClick={increment(setSeconds, 60)} className="btn-small">
                +
              </button>
              <button onClick={decrement(setSeconds, 60)} className="btn-small">
                -
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleCountdownStart}
          className="bg-blue-500 text-white p-2 rounded m-2"
        >
          Start Countdown
        </button>
        <button
          onClick={handleCountdownReset}
          className="bg-red-500 text-white p-2 rounded m-2"
        >
          Reset Countdown
        </button>
        <div className="stopwatch">
          <h2>Stopwatch</h2>
          <div className="text-4xl font-mono">{formatStopwatchTime()}</div>
          <button
            onClick={handleStartStop}
            className="bg-green-500 text-white p-2 rounded m-2"
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white p-2 rounded m-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

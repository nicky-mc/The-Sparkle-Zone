import React from "react";

export default function CounterButton({ onClick }) {
  return (
    <button onClick={onClick} className="counter-button">
      Increment
    </button>
  );
}

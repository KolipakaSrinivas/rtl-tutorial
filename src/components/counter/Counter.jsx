import React, { useState } from "react";

const Conter = () => {
  const [count, setCount] = useState(0);
  const [amount, setAmount] = useState(0);
  const incrementCounter = () => {
    setCount((prevCount) => prevCount + 1);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <h1>{count}</h1>
      <button
        type="button"
        onClick={incrementCounter}
        style={{ padding: "10px" }}
      >
        Increment
      </button>
      <input
        name="amount"
        type="number"
        value={amount}
        placeholder="Enter Your Amount"
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      <button type="button" onClick={() => setCount(amount)}>set</button>
    </div>
  );
};

export default Conter;

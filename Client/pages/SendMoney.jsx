import React, { useState } from "react";

function SendMoney() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber && amount > 0) {
      // Open password popup
      setIsModalOpen(true);
    } else {
      setMessage("Please enter a valid phone number and amount");
    }
  };

  const handleTransfer = async () => {
    const token = localStorage.getItem("token"); // Get JWT token from local storage

    try {
      const response = await fetch("http://127.0.0.1:5000/api/send-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify({
          phoneNumber,
          amount,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success: ${data.message}`);
        setIsModalOpen(false);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="form">
        <label htmlFor="phoneno">Enter Phone Number</label>
        <input
          type="number"
          name="phno"
          id="phno"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={handleSubmit}>Send Money</button>
      </div>

      {message && <p>{message}</p>}

      {isModalOpen && (
        <div className="modal">
          <h2>Enter your password</h2>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleTransfer}>Verify and Send</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default SendMoney;

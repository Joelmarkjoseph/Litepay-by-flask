import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after success

function SendMoney() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Navigate to a success page or dashboard

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber && amount > 0) {
      // Open password popup
      setIsModalOpen(true);
    } else {
      setMessage("Please enter a valid phone number and amount.");
    }
  };

  const handleTransfer = async () => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token
    const response = await fetch("http://127.0.0.1:5000/api/send-money", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token
      },
      body: JSON.stringify({
        phoneNumber,
        amount,
        password, // Password entered for verification
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(`Error: ${data.message}`);
    } else {
      setMessage("Money sent successfully!");
      await sendEmail(token); // Call the email sending function
      setIsModalOpen(false); // Close the modal after success
      navigate("/success"); // Redirect to a success page
    }
  };

  const sendEmail = async (token) => {
    await fetch("http://127.0.0.1:5000/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // Add required email content if necessary
      }),
    });
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

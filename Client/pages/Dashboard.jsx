import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // For accessing passed state

function Dashboard() {
  const location = useLocation(); // Access uid passed from login
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { uid } = location.state; // Get uid from location.state
      const token = localStorage.getItem("token"); // Get JWT from local storage

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/user/${uid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Set the JWT in the Authorization header
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch user details: ${errorText}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [location.state]);
  const nav = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("token"); // Clear JWT from local storage
    setUser(null);
    nav("/login");
    // Redirect to login or another page if necessary
  };
  const sendMoney = async () => {
    nav("/sendmoney");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Hi, {user.name}!</h2>
      <p>Your balance is: {user.balance}</p>
      <button onClick={sendMoney}>Send Money</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router v6
import Navcomp from "../components/Navcomp";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // For redirection using React Router

  const onClick = async () => {
    const loginData = {
      phoneNumber,
      password,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.status === 200) {
        const data = await response.json();
        navigate("/dashboard"); // Redirecting using React Router
      } else if (response.status === 401) {
        const data = await response.json();
        setErrorMessage(data.message); // Invalid credentials
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login: " + error.message);
    }
  };

  return (
    <>
      <Navcomp />
      <div className="container" align="center">
        <div className="logina">
          <h3>Login</h3>
          <p>Phone Number</p>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <br />
          <button onClick={onClick}>Enter</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default Login;

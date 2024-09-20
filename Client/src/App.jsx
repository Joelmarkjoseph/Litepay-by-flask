import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "../pages/home";
import Register from "../pages/Register";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

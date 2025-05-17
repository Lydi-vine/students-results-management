import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:1234/register", {
        username,
        password,
      });

      if (res.data.success) {
        alert("Registration successful! You can now log in.");
        navigate("/");
      } else {
        alert(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Username already taken. Try another.");
    }
  };

  return (
    <div className="myForm" style={{ padding: "2rem" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <br />
        <button type="submit">Register</button>
        <p> Already have an account?{" "} <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/")}> Login </span> </p>
      </form>
    </div>
  );
}

export default RegisterPage;

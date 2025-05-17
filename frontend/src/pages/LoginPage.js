import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Sections.css'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:1234/login", { username, password,});
      if (res.data.message === "Login successful") {
        onLogin(res.data.userId);
        navigate("/dashboard")
      } else {
        setError("Invalid credentials"); 
      }
    } catch (err) {
      console.error(err);
      setError("Incorrect username or password"); 
    }
  };

  return (
    <div className="myForm" style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required/>
        <br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
        <br />
        <button type="submit">Login</button>
        <p>Don't have an account? <span style={{color:'blue', cursor:'pointer' }} onClick={() => navigate('/register')}>Create account</span></p>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;

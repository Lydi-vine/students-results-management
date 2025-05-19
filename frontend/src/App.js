import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";

import Trainees from "./pages/Trainees";
import Trades from "./pages/Trades";
import Modules from "./pages/Modules";
import Marks from "./pages/Marks";
import Reports from "./pages/Reports";
import DashboardHome from "./pages/DashboardHome";


function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/" />}>
          <Route index element={<DashboardHome />} />
          <Route path="trainees" element={<Trainees />} />
          <Route path="trades" element={<Trades />} />
          <Route path="modules" element={<Modules />} />
          <Route path="marks" element={<Marks />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

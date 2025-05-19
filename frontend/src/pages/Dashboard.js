import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("loggedIn");
  navigate("/");
};

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="sidebar-title">SOS MSR</h2>
        <NavLink to="trainees" className={({ isActive }) => isActive ? "sidebar-btn active" : "sidebar-btn"}>Trainees</NavLink>
        <NavLink to="trades" className={({ isActive }) => isActive ? "sidebar-btn active" : "sidebar-btn"}>Trades</NavLink>
        <NavLink to="modules" className={({ isActive }) => isActive ? "sidebar-btn active" : "sidebar-btn"}>Modules</NavLink>
        <NavLink to="marks" className={({ isActive }) => isActive ? "sidebar-btn active" : "sidebar-btn"}>Marks</NavLink>
        <NavLink to="reports" className={({ isActive }) => isActive ? "sidebar-btn active" : "sidebar-btn"}>Reports</NavLink>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;

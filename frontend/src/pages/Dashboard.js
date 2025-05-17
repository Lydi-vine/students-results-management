import React, { useState } from "react";
import Trainees from "./Trainees";
import Trades from "./Trades";
import Modules from "./Modules";
import Marks from "./Marks";
import Reports from "./Reports";
import "./Dashboard.css";

function Dashboard() {
  const [section, setSection] = useState("Trainees");

  const renderSection = () => {
    switch (section) {
      case "Trainees": return <Trainees />;
      case "Trades": return <Trades />;
      case "Modules": return <Modules />;
      case "Marks": return <Marks />;
      case "Reports": return <Reports />;
      default: return <Trainees />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="sidebar-title">SOS MSR</h2>
        <button className={`sidebar-btn ${section === "Trainees" ? "active" : ""}`} onClick={() => setSection("Trainees")}> Trainees</button>
        <button className={`sidebar-btn ${section === "Trades" ? "active" : ""}`} onClick={() => setSection("Trades")}> Trades</button>
        <button className={`sidebar-btn ${section === "Modules" ? "active" : ""}`} onClick={() => setSection("Modules")}> Modules</button>
        <button className={`sidebar-btn ${section === "Marks" ? "active" : ""}`} onClick={() => setSection("Marks")}> Marks</button>
        <button className={`sidebar-btn ${section === "Reports" ? "active" : ""}`} onClick={() => setSection("Reports")}> Reports</button>
        <button className="logout-btn" onClick={() => window.location.href = "/"}> Logout</button>
      </div>
      <div className="main-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default Dashboard;

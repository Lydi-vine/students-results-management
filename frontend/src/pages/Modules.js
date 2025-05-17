import React, { useState, useEffect } from "react";
import axios from "axios";

function Modules() {
  const [moduleName, setModuleName] = useState("");
  const [moduleCredits, setModuleCredits] = useState("");
  const [modules, setModules] = useState([]);

  const handleAddModule = async () => {
    try {
      const res = await axios.post("http://localhost:1234/addModule", { modname: moduleName, modcredits: moduleCredits });
      alert(res.data.message);
      setModuleName("");
      setModuleCredits("");
      fetchModules(); 
    } catch (err) {
      console.error(err);
      alert("Error adding module");
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:1234/modules");
      setModules(res.data.modules);
    } catch (err) {
      console.error(err);
      alert("Error fetching modules");
    }
  };

  useEffect(() => {
    fetchModules();  // Fetch modules on page load
  }, []);

  return (
    <div>
      <h2>Manage Modules</h2>
      <input 
        type="text" 
        value={moduleName} 
        onChange={(e) => setModuleName(e.target.value)} 
        placeholder="Enter Module Name" 
      />
      <input 
        type="number" 
        value={moduleCredits} 
        onChange={(e) => setModuleCredits(e.target.value)} 
        placeholder="Enter Module Credits" 
      />
      <button onClick={handleAddModule}>Add Module</button>
      
      <h3>Existing Modules</h3>
      <ul>
        {modules.map((module) => (
          <li key={module.module_id}>{module.modname} ({module.modcredits} credits)</li>
        ))}
      </ul>
    </div>
  );
}

export default Modules;

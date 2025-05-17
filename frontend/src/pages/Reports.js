import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportCard() {
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [report, setReport] = useState(null);

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [moduleReport, setModuleReport] = useState(null);

  useEffect(() => {
    fetchTrainees();
    fetchModules();
  }, []);

  const fetchTrainees = async () => {
    const res = await axios.get("http://localhost:1234/trainees");
    setTrainees(res.data.trainees);
  };

  const fetchModules = async () => {
    const res = await axios.get("http://localhost:1234/modules");
    setModules(res.data.modules);
  };

  const fetchReport = async () => {
    if (!selectedTrainee) return;
    const res = await axios.get(`http://localhost:1234/report/${selectedTrainee}`);
    setReport(res.data);
  };

  const fetchModuleReport = async () => {
    if (!selectedModule) return;
    try {
      const res = await axios.get(`http://localhost:1234/module-report/${selectedModule}`);
      console.log("moduleReport state:", moduleReport);
      console.log("Module Report Response:", res.data); 
      setModuleReport(res.data);
    } catch (error) {
      console.error("Error fetching module report:", error);
    }
  };

  return (
    <div>
      <h2>Report Card</h2>

      <div>
        <h4>Individual Trainee Report</h4>
        <select value={selectedTrainee} onChange={(e) => setSelectedTrainee(e.target.value)}>
          <option value="">Select Trainee</option>
          {trainees.map((t) => (
            <option key={t.trainee_id} value={t.trainee_id}>
              {t.firstnames} {t.lastname}
            </option>
          ))}
        </select>
        <button onClick={fetchReport}>View Report</button>
      </div>

      {report && report.results && report.results.length > 0 && (
        <div>
          <h3>{report.trainee} — {report.trade}</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Module</th>
                <th>Formative</th>
                <th>Summative</th>
                <th>Comprehensive</th>
                <th>Total (100)</th>
              </tr>
            </thead>
            <tbody>
              {report.results.map((m, i) => (
                <tr key={i}>
                  <td>{m.modname}</td>
                  <td>{m.formative_ass}</td>
                  <td>{m.summative_ass}</td>
                  <td>{m.comprehensive_ass}</td>
                  <td>{m.total_marks_100}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="4"><strong>Total</strong></td>
                <td><strong>{report.total.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="4"><strong>Average</strong></td>
                <td><strong>{report.average.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <br />
      <hr />

      <div>
        <h4> Module Report</h4>
        <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
          <option value="">Select Module</option>
          {modules.map((mod) => (
            <option key={mod.module_id} value={mod.module_id}>
              {mod.modname}
            </option>
          ))}
        </select>
        <button onClick={fetchModuleReport}>View Module Report</button>
      </div>

      {moduleReport && moduleReport.results && moduleReport.results.length > 0 ? (
  <div>
    <h3>Module: {moduleReport.module}</h3>
    <table border="1">
      <thead>
        <tr>
          <th>Trainee</th>
          <th>Trade</th>
          <th>Formative</th>
          <th>Summative</th>
          <th>Comprehensive</th>
          <th>Total (100)</th>
        </tr>
      </thead>
      <tbody>
        {moduleReport.results.map((t, i) => (
          <tr key={i}>
            <td>{t.firstnames} {t.lastname}</td>
            <td>{t.trade_name}</td>
            <td>{t.formative_ass}</td>
            <td>{t.summative_ass}</td>
            <td>{t.comprehensive_ass}</td>
            <td>{t.total_marks_100}</td>
          </tr>
        ))}
        <tr>
        <td colSpan="5"><strong>Total</strong></td>
        <td><strong> {moduleReport.total.toFixed(2)}</strong></td>
        </tr>
        <tr>
        <td colSpan="5"><strong>Average</strong></td>
        <td><strong> {moduleReport.average.toFixed(2)} </strong></td>
        </tr>
      </tbody>
    </table>
  </div>
) : (
  <p>No data available for this module.</p>
)}


    </div>
  );
}

export default ReportCard;

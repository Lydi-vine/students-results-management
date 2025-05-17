import React, { useEffect, useState } from "react";
import axios from "axios";

function Marks() {
  const [trainees, setTrainees] = useState([]);
  const [modules, setModules] = useState([]);
  
  const [traineeId, setTraineeId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [formative, setFormative] = useState(0);
  const [summative, setSummative] = useState(0);
  const [comprehensive, setComprehensive] = useState(0);
  const [userId] = useState(1); // hardcoded for now
  const [marksList, setMarksList] = useState([]);

  const fetchData = async () => {
    const t = await axios.get("http://localhost:1234/trainees");
    setTrainees(t.data.trainees);

    const m = await axios.get("http://localhost:1234/modules");
    setModules(m.data.modules);

    const all = await axios.get("http://localhost:1234/marks");
    setMarksList(all.data.marks);
  };

  const handleAddMark = async () => {
    try {
      // Calculate total marks (Formative + Summative + Comprehensive) / 50 * 100
      const total_marks_100 = (parseFloat(formative) + parseFloat(summative) + parseFloat(comprehensive)) / 50 * 100;
      
      await axios.post("http://localhost:1234/addMark", {
        trainee_id: traineeId,
        module_id: moduleId,
        user_id: userId,
        formative_ass: parseFloat(formative),
        summative_ass: parseFloat(summative),
        comprehensive_ass: parseFloat(comprehensive),
        total_marks_100
      });
      alert("Mark recorded!");
      fetchData();
      setFormative(0);
      setSummative(0);
      setComprehensive(0);
    } catch (err) {
      alert("Error adding mark");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Manage Marks</h2>

      <select value={traineeId} onChange={(e) => setTraineeId(e.target.value)}>
        <option value="">Select Trainee</option>
        {trainees.map((t) => (
          <option key={t.trainee_id} value={t.trainee_id}>
            {t.firstnames} {t.lastname}
          </option>
        ))}
      </select>

      <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
        <option value="">Select Module</option>
        {modules.map((m) => (
          <option key={m.module_id} value={m.module_id}>
            {m.modname}
          </option>
        ))}
      </select>

      <input type="number" placeholder="Formative (out of 50)" value={formative} onChange={(e) => setFormative(e.target.value)} /> <br />
      <input type="number" placeholder="Summative (out of 50)" value={summative} onChange={(e) => setSummative(e.target.value)} /> 
      <input type="number" placeholder="Comprehensive (out of 50)" value={comprehensive} onChange={(e) => setComprehensive(e.target.value)} />

      <button onClick={handleAddMark}>Submit Marks</button>

      <h3>Recorded Marks</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Trainee</th>
            <th>Trade</th>
            <th>Module</th>
            <th>Formative</th>
            <th>Summative</th>
            <th>Comprehensive</th>
            <th>Total (100)</th>
          </tr>
        </thead>
        <tbody>
          {marksList.map((m) => (
            <tr key={m.mark_id}>
              <td>{m.firstnames} {m.lastname}</td>
              <td>{m.trade_name}</td>
              <td>{m.modname}</td>
              <td>{m.formative_ass}</td>
              <td>{m.summative_ass}</td>
              <td>{m.comprehensive_ass}</td>
              <td>{m.total_marks_100}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Marks;

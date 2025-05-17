import React, { useState, useEffect } from "react";
import axios from "axios";
import './Sections.css'

function Trainees() {
  const [firstnames, setFirstnames] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [tradeId, setTradeId] = useState("");
  const [trades, setTrades] = useState([]);
  const [trainees, setTrainees] = useState([]);

  const fetchTrades = async () => {
    const res = await axios.get("http://localhost:1234/trades");
    setTrades(res.data.trades);
  };

  const fetchTrainees = async () => {
    const res = await axios.get("http://localhost:1234/trainees");
    setTrainees(res.data.trainees);
  };

  const handleAddTrainee = async () => {
    try {
      await axios.post("http://localhost:1234/addTrainee", {
        firstnames,
        lastname,
        gender,
        trade_id: tradeId,
      });
      alert("Trainee added!");
      setFirstnames("");
      setLastname("");
      setGender("");
      setTradeId("");
      fetchTrainees();
    } catch (err) {
      alert("Error adding trainee");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrades();
    fetchTrainees();
  }, []);

  return (
    <div>
      <h2>Manage Trainees</h2>
      <input type="text" placeholder="First names" value={firstnames} onChange={(e) => setFirstnames(e.target.value)} /> 
      <input type="text" placeholder="Last name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <select value={tradeId} onChange={(e) => setTradeId(e.target.value)}>
        <option value="">Select Trade</option>
        {trades.map((trade) => (
          <option key={trade.trade_id} value={trade.trade_id}>
            {trade.trade_name}
          </option>
        ))}
      </select>
      <button onClick={handleAddTrainee}>Add Trainee</button>

      <h3>Registered Trainees</h3>
      <ul>
        {trainees.map((t) => (
          <li key={t.trainee_id}>
            {t.firstnames} {t.lastname} - {t.gender} - {t.trade_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trainees;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Trades() {
  const [tradeName, setTradeName] = useState("");
  const [trades, setTrades] = useState([]);

  const handleAddTrade = async () => {
    try {
      const res = await axios.post("http://localhost:1234/addTrade", { trade_name: tradeName });
      alert(res.data.message);
      setTradeName("");
      fetchTrades();  // Refresh trades list
    } catch (err) {
      console.error(err);
      alert("Error adding trade");
    }
  };

  const fetchTrades = async () => {
    try {
      const res = await axios.get("http://localhost:1234/trades");
      setTrades(Array.isArray(res.data.trades) ? res.data.trades : []);
    } catch (err) {
      console.error(err);
      alert("Error fetching trades");
    }
  };  

  useEffect(() => {
    fetchTrades();  // Fetch trades on page load
  }, []);

  return (
    <div>
      <h2>Manage Trades</h2>
      <input 
        type="text" 
        value={tradeName} 
        onChange={(e) => setTradeName(e.target.value)} 
        placeholder="Enter Trade Name" 
      />
      <button onClick={handleAddTrade}>Add Trade</button>
      
      <h3>Existing Trades</h3>
      <ul>
        {trades.map((trade) => (
          <li key={trade.trade_id}>{trade.trade_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Trades;

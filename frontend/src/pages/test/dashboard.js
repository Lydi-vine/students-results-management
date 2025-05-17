import react from 'react';
import Trainees from "../Trainees";
import Trades from "../Trades";
import Module from "../Modules";
import Marks from "../Marks";
import Reports from "../Reports"
import Dashboard from '../Dashboard';

function dashboard(){
    const [section, setSection] = useState("Trainees");
    const renderSection = () => {
        switch(section) {
            case "Trainees": return <Trainees />
            case "Trades": return <Trades />
            case "Module": return <Module />
            case "Marks": return <Marks />
            case "Reports": return <Reports />
            default: return <Trainees />
        }
    };

    return(
        <div>
            <div>
                <h2>Welcome User</h2>
                <button className={`sidebar-btn ${section === "Trainees" ? "active": ""}`} onClick={() => setSection("Trainees")}>Trainees</button>
                <button className={`sidebar-btn ${section === "Trades" ? "active": ""}`} onClick={() => setSection("Trades")}>Trades</button>
                <button className={`sidebar-btn ${section === "Marks" ? "active": ""}`} onClick={() => setSection("Marks")}>Marks</button>
                <button className={`sidebar-btn ${section === "Modules" ? "active": ""}`} onClick={() => setSection("Modules")}>Modules</button>
                <button className={`sidebar-btn ${section === "Reports" ? "active": ""}`} onClick={() => setSection("Reports")}>Reports</button>
                <button className='logout-btn' onClick={() => window.location.href="/"}></button>
            </div>
            <div>
                {renderSection()}
            </div>
        </div>
    )
}

export default Dashboard;
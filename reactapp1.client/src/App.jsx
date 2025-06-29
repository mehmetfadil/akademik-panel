import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Main from "./Components/Main";
import SinavProgrami from "./Components/SinavProgrami";
import SittingPlan from "./Components/SittingPlan";
import DoorTag from "./Components/DoorTag"
import RoomAssignments from "./Components/RoomAssignments"
import SchedulePlanner from "./Components/SchedulePlanner"
import Userlist from "./Components/UserList"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={<Main />} />
                <Route path="/sinav-programi" element={<SinavProgrami />} />
                <Route path="/sinav-oturma-duzeni" element={<SittingPlan />} />
                <Route path="/ogretim-elemani-programi" element={<DoorTag />} />
                <Route path="//derslik-ders-atama" element={<RoomAssignments />} />
                <Route path="//ders-programi" element={<SchedulePlanner />} />
                <Route path="//user-management" element={<Userlist />} />
            </Routes>
        </Router>
    );
}

export default App;

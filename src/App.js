import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LogActivity from "./pages/LogActivity";
import MismatchMap from "./pages/MismatchMap";
import StressLag from "./pages/StressLag";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log-activity" element={<LogActivity />} />
          <Route path="/mismatch-map" element={<MismatchMap />} />
          <Route path="/stress-lag" element={<StressLag />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
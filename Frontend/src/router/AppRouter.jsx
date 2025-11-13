import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "../pages/login/login.jsx";
import Signup from "../pages/signup/signup.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";

export default function AppRouter(){
    return(
        <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    );
}
  
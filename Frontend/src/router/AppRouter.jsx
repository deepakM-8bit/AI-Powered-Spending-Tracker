import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "../pages/login.jsx";
import Signup from "../pages/signup.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";
import LandingPage from '../pages/LandingPage.jsx';

export default function AppRouter(){
    return(
        <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    );
}
  
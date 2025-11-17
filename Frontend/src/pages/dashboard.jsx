import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import AnalyticsSection from "../components/AnalyticsSection.jsx";
import AIBotSection from "../components/AIBotSection.jsx";
import { useAuth } from "../context/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token,navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto px-4 pb-20 space-y-14">

        <HeroSection />

        <ExpenseForm />

        <ExpenseList />

        <AnalyticsSection />

        <AIBotSection />

      </div>
    </div>
  );
}

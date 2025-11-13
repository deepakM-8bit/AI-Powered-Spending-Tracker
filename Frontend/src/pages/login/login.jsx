import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginForm, setLoginForm] = useState({
    email:"",
    password:""
  });
  const navigate = useNavigate();
  const {login} = useAuth();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const res = await axios.post("http://localhost:3000/api/auth/login",loginForm);
    const {token} = res.data;
    
    login(token, {email:loginForm.email});
    navigate("/dashboard");
    console.log(loginForm.email,loginForm.password);
    setLoginForm({email:"",password:""});
    }catch(err){
      console.log(err.message);
    }

  };

  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="left-section">
        <h1>AI Expense Tracker</h1>
        <p>
          Track your spending effortlessly.  
          Get AI-powered insights, budgeting suggestions,
          and smart analytics to save more every month.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">
        <div className="login-container">
        <h2>Login</h2>

       

        <form onSubmit={handleSubmit} className="login-form">
          {/* User Icon */}
        <div className="user-icon">
          <span>👤</span>
        </div>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm,email:e.target.value})}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm,password:e.target.value})}
            required
          />

          <button type="submit" className="login-btn">Login</button>
        </form>
        </div>
      </div>

    </div>
  );
}

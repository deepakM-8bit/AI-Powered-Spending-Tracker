import { useState } from "react";
// import "./Login.css"; // import the styles

export default function Login() {
  const [loginForm, setLoginForm] = useState(
    {
      name:"",
      password:""
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", loginForm.email);
    console.log("Password:", loginForm.password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Avatar Section */}
        <div className="avatar-wrapper">
          <div className="avatar-circle">
            <span className="avatar-text">Your Photo</span>
          </div>
        </div>

        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            value={loginForm.email}
            onChange={(e) => setLoginForm(...loginForm,e.target.value)}
            required
          />

          {/* Password Field */}
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="Enter your password"
            value={loginForm.password}
            onChange={(e) => setLoginForm(...loginForm,e.target.value)}
            required
          />

          {/* Login Button */}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

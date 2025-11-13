import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [signupForm, setSignupForm] = useState({
    name:"",
    email:"",
    password:""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/signup", signupForm);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e) => setSignupForm({...signupForm,name:e.target.value})} />
      <input type="email" placeholder="Email" onChange={(e) => setSignupForm({...signupForm,email:e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setSignupForm({...signupForm,password:e.target.value})} />
      <button type="submit">Signup</button>
    </form>
  );
}

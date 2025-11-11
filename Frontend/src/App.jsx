import { useEffect,useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ExpensesForm from "./components/ExpensesForm";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Dashboard from "./pages/dashboard.jsx";


const API = "http://localhost:3000/api/expenses";
const App = () =>{
  const[expenses,setExpenses] = useState([]);
  
  const fetchExpenses = async() =>{
      await axios.get(API)
       .then((res)=>{
         console.log(res.data);
         setExpenses(res.data);
      })
       .catch((err)=> console.error(err));
  }

  useEffect(()=>{
    fetchExpenses();
  },[]);

  return(
    <>
      
      <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
      <ExpensesForm />
      <table>
        <thead>
        <tr>
          <th>TITLE</th>
          <th>AMOUNT</th>
          <th>CATEGORY</th>
          <th>DATE</th>
          <th>NOTE</th>
          <th>Recurring</th>
        </tr>
        </thead>
        <tbody>
          {expenses.map((e)=>(
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>{e.amount}</td>
              <td>{e.category}</td>
              <td>{e.date}</td>
              <td>{e.note}</td>
              <td>{e.reccuring}</td>
              <td>
              <button>Edit</button>
              <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>    
      </table>
      {console.log(expenses)}
    </>
  );
}

export default App;
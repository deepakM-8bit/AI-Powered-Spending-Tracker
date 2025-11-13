 import axios from "axios";
 import { useState,useEffect } from "react"; 
  
  export function ExpensesTable(){
        const API = "http://localhost:3000/api/expenses";

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
    );
}
   
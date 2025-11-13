import ExpensesForm from "./components/ExpensesForm";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";

const App = () => {

  return(
    <>
      
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <ExpensesForm /> 

    </>
  );
}

export default App;
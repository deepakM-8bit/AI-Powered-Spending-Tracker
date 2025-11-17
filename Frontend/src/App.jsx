import AppRouter from "./router/AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {

  return(
    <>
      
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      

    </>
  );
}

export default App;
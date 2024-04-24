import { Routes, Route } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import Welcomepage from "./pages/Welcomepage";
import Navbar from "./components/navbar";
import { AuthContextProvider } from "./context/AuthContext";
import Protected from "./components/protected";

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Loginpage />}></Route>
          <Route
            path="/welcomepage"
            element={
              <Protected>
                <Welcomepage />
              </Protected>
            }
          ></Route>
        </Routes>
      </AuthContextProvider>
    </>
  );
};

export default App;

// Kommentar

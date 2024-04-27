import { Routes, Route } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import Householdpage from "./pages/Householdpage";
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
            path="/households"
            element={
              <Protected>
                <Householdpage />
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


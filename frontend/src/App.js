import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Navbar from "./components/navbar";
import { AuthContextProvider } from "./context/AuthContext";
import Protected from "./components/protected";

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/account"
            element={
              <Protected>
                <Account />
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
